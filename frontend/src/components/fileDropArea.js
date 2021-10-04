import React, { useRef, useState, useEffect } from 'react';
import gif from '../loading.gif';
import axios from '../Axios';
import icon from '../upload-icon.png';

const FileDropArea = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [validFiles, setValidFiles] = useState([]);

  useEffect(() => {
    let filteredArray = selectedFiles.reduce((file, current) => {
      const x = file.find((item) => item.name === current.name);
      if (!x) {
        return file.concat([current]);
      } else {
        return file;
      }
    }, []);
    setValidFiles([...filteredArray]);
  }, [selectedFiles]);

  const colorizeRequest = async (name) => {
    const file = validFiles.filter((f) => f.name === name)[0];
    const temp = file;
    temp['isLoading'] = true;
    setValidFiles(validFiles.map((file) => (file.name === name ? temp : file)));
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/colorize', formData);

    let newObject = null;
    if (res.data.status_code === 200) {
      newObject = {
        name: file.name,
        url: `${process.env.PUBLIC_URL}/results/${res.data.result}`,
        colorized: true,
        isLoading: false,
      };
    } else {
      newObject = {
        name: file.name,
        url: '',
        colorized: false,
        isLoading: false,
        invalid: true,
        errorMessage: res.data.message,
      };
    }
    setValidFiles(
      validFiles.map((file) => (file.name === name ? newObject : file))
    );
    setSelectedFiles(
      selectedFiles.map((file) => (file.name === name ? newObject : file))
    );
  };
  const fileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (name) => {
    const validFileIndex = validFiles.findIndex((e) => e.name === name);
    validFiles.splice(validFileIndex, 1);
    setValidFiles([...validFiles]);

    const selectedFileIndex = selectedFiles.findIndex((e) => e.name === name);
    selectedFiles.splice(selectedFileIndex, 1);
    setSelectedFiles([...selectedFiles]);
  };

  var total = selectedFiles.length;

  const fileInputRef = useRef();
  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (total > 5) {
      file['errorMessage'] = 'Too many files selected';
      return false;
    } else if (validTypes.indexOf(file.type) === -1) {
      file['errorMessage'] = 'File type is not supported';
      return false;
    } else if (file.size > 5000000) {
      file['errorMessage'] = 'File is too large';
      return false;
    }
    return true;
  };

  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      total += 1;
      if (validateFile(files[i])) {
        // add to an array so we can display the name of file
        files[i]['url'] = URL.createObjectURL(files[i]);
        files[i]['colorized'] = false;
        files[i]['isLoading'] = false;
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
      } else {
        // add a new property called invalid
        files[i]['invalid'] = true;
        files[i]['url'] = URL.createObjectURL(files[i]);
        // add to the same array so we can display the name of the file
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);

        // set error message
      }
    }
  };
  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      handleFiles(fileInputRef.current.files);
    }
  };

  return (
    <div className='drop-container'>
      <h1 className='drop-header'>Try it!</h1>
      <div className='drop-wrap'>
        <div
          className='drop-zone'
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
        >
          <div className='drop-message' onClick={fileInputClicked}>
            <div className='upload-image'>
              <img src={icon} alt='' />
            </div>
            <p>Drag & Drop files here or click to upload</p>

            <input
              ref={fileInputRef}
              className='file-input'
              type='file'
              multiple
              onChange={filesSelected}
            />
          </div>
        </div>

        <div className='display-container'>
          {validFiles.map((data, i) => (
            <div className='file-status-bar' key={i}>
              <div className='image-preview'>
                <img src={data.url} alt='' />
              </div>
              {/* <div className='file-type'>{fileType(data.name)}</div> */}
              <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>
                {data.name.length > 10
                  ? data.name.substring(0, 10) + '...'
                  : data.name}
              </span>
              {!data.colorized && (
                <span className='file-size'>({fileSize(data.size)})</span>
              )}

              {data.invalid && (
                <span className='file-error-message'>{data.errorMessage}</span>
              )}

              {data.colorized ? (
                <button className='btn'>
                  <a href={data.url} target='_blank' rel='noreferrer' download>
                    Download
                  </a>{' '}
                </button>
              ) : data.isLoading ? (
                <img src={gif} alt='' width='70px' />
              ) : (
                <div>
                  <button
                    className='btn'
                    onClick={() => colorizeRequest(data.name)}
                    disabled={data.invalid}
                  >
                    Start
                  </button>
                  <button
                    className='btn file-remove'
                    onClick={() => removeFile(data.name)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileDropArea;
