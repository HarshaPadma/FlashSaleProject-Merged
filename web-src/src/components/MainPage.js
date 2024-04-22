/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState } from 'draft-js';
import React, {useEffect, useState} from 'react'
import './Mainpage.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Function from '@spectrum-icons/workflow/Function';
import {
    Flex,
    Form,
    Picker,
    ActionButton,
    Item,
    Text,
    View
} from '@adobe/react-spectrum'
import axios from "axios";

export const MainPage = (props) => {
    useEffect(() => {
        fetchCategoryData()
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        fetchStoreData()
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const [state, setState] = useState({
        storeviewSelected: null,
        categorySelected: null,
        imageSelected: ''
    })
    const [results, setResults] = useState([]);
    const [selectedStartDateTime, setSelectedStartDateTime] = useState('');

    const [selectedEndDateTime, setSelectedEndDateTime] = useState('');
    const handleStartDateChange = event => {
        const selectedStartDateTimeValue = event.target.value;
        const selectedStartDateTimeObj = new Date(selectedStartDateTimeValue);
        const currentDateTime = new Date();
        if (selectedStartDateTimeObj > currentDateTime) {
            setSelectedStartDateTime(selectedStartDateTimeValue);
        } else {
            alert('Select date and time greater than current value!');
            // Reset the input value
            event.target.value = selectedStartDateTime;
        }
    };
    const handleEndDateChange = event => {
        const selectedEndDateTimeValue = event.target.value;
        const selectedEndDateTimeObj = new Date(selectedEndDateTimeValue);
        const startDateTimeObj = new Date(selectedStartDateTime);

        // Extract date and time components separately
        const endDate = new Date(selectedEndDateTimeObj.getFullYear(), selectedEndDateTimeObj.getMonth(), selectedEndDateTimeObj.getDate());
        const endTime = selectedEndDateTimeObj.getHours() * 3600 + selectedEndDateTimeObj.getMinutes() * 60 + selectedEndDateTimeObj.getSeconds();

        const startDate = new Date(startDateTimeObj.getFullYear(), startDateTimeObj.getMonth(), startDateTimeObj.getDate());
        const startTime = startDateTimeObj.getHours() * 3600 + startDateTimeObj.getMinutes() * 60 + startDateTimeObj.getSeconds();

        // Check if end date is greater than or equal to start date
        // and end time is greater than start time
        if (endDate > startDate || (endDate.getTime() === startDate.getTime() && endTime > startTime)) {
            setSelectedEndDateTime(selectedEndDateTimeValue);
        } else {
            alert('Select date and time greater than start value!');
            // Reset the input value
            event.target.value = selectedEndDateTime;
        }
    };
    const [image, setImage] = useState();

    const imageUpload = event => {
        const file = event.target.files[0]; // Get the first file selected
        setImage(URL.createObjectURL(file));
        if (file) {
            const fileName = file.name;
            const fileType = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
            const timeStamp = new Date().toJSON();
            const fileNameFull = fileName.substring(0, fileName.lastIndexOf('.'))+'_'+timeStamp;
            if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') {
                setState({ ...state, imageSelected: fileNameFull });
            } else {
                alert('Please upload an image of JPEG or PNG or GIF format.');
            }
        }
    };
    const [text, setText] = useState('');
    // const contentState = ContentState.createFromText('Hello');
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const newEditorState = EditorState.set(editorState, {
        allowUndo: false,
    });
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    };
    const [stores, setStores] = useState([]);
    function buildFlattenedArray(items, parentPath, depth) {
        const children = items.filter(item => item.path.startsWith(parentPath + '/') && item.path.split('/').length === parentPath.split('/').length + 1);

        if (children.length === 0) {
            return [];
        }

        const flattenedArray = [];
        children.forEach(child => {
            flattenedArray.push('--'.repeat(depth) + child.name);
            const nestedChildren = buildFlattenedArray(items, child.path, depth + 1);
            flattenedArray.push(...nestedChildren);
        });

        return flattenedArray;
    }
    async function fetchCategoryData() {

        axios.get('http://localhost:3000')
            .then(response => {
                const results = response.data;
                const parentPath = "1/2";
                const flattenedArray= buildFlattenedArray(results['data']['categories']['items'], parentPath, 1);
                setResults(flattenedArray);
                console.log(flattenedArray);
            })
            .catch(error => {
                console.error('There was a problem with the axios request:', error);
            });
    }
    async function fetchStoreData() {
        axios.get('http://localhost:3005')
            .then(response => {
                const results = response.data;
                const newOptions = results['data']['availableStores'].map((item) => ({ name: item.store_name, value: item.store_code}));
                setStores(newOptions);
                console.log(newOptions);
            })
            .catch(error => {
                console.error('There was a problem with the axios request:', error);
            });
    }
    return (
        <div className="form-container">
        <View width="size-4000">
            <div className="header-container">
                <h1>Flashsale Settings</h1>
            </div>
            {(
                <Form>
                    <Picker
                        label={
                            <span style={{ fontWeight: "bold" }}>
                            Select Store View
                            <span style={{ color: "red" }}> *</span>
                            </span>
                        }
                        placeholder="select store-view"
                        aria-label="select store-view"
                        items={stores}
                        itemKey="name"
                        onSelectionChange={(name) =>
                            setState({
                                ...state,
                                storeviewSelected: name
                            })
                        }
                    >
                        {(item) => <Item key={item.name}>{item.name}</Item>}
                    </Picker>
                    <label style={{fontWeight:'bold',fontSize:'12px'}}>
                        Event Start From
                        <span style={{ color: "red" }}> *</span>
                    </label>
                    <input aria-label="Event Start From" type="datetime-local"
                           required={true}
                           onChange={handleStartDateChange}
                           style={{ width: '594px',height:"28px"}}/>
                    <label style={{fontWeight:'bold',fontSize:'12px'}}>
                        Event End
                        <span style={{ color: "red" }}> *</span>
                    </label>
                    <input aria-label="Event End" type="datetime-local"
                           onChange={handleEndDateChange}
                           required={true}
                           style={{ width: '594px',height:"28px" }}/>
                    <label style={{fontWeight:'bold',fontSize:'12px'}}>
                        Description
                    </label>
                    <Editor
                        editorState={editorState}
                        editorStyle={{ backgroundColor: 'white',border: '1px solid #ccc', borderRadius: '5px' }}
                        onEditorStateChange={onEditorStateChange}
                    />
                    <div style={{ height: '10px' }}></div>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Choose Banner Image
                    </label>
                    <input id="file-upload" type="file" accept="image/*" required={true} onChange={imageUpload}/>
                    <img src={image} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                    <label htmlFor="options" style={{fontWeight:'bold',fontSize:'12px'}}>
                        Select a category
                        <span style={{ color: "red" }}> *</span>
                    </label>
                    <div>
                        <select id="options" style={{padding: '6px', width:"600px", height:"35px",fontFamily: "Arial, sans-serif",fontStyle:"italic",fontWeight:'lighter'}} onChange={(name) =>
                            setState({
                                ...state,
                                categorySelected: name
                            })
                        }>
                            <option value="">Select category</option>
                            {results.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <Flex>
                        <ActionButton
                            variant="primary"
                            type="button"
                            onPress={invokeAction}
                            isDisabled={!state.categorySelected}
                        ><Function aria-label="Invoke" /><Text>Save</Text></ActionButton>
                    </Flex>
                </Form>
            )}
        </View>
        </div>
    )

    // invokes a the selected backend actions
    function invokeAction () {
        alert('Saved!!!');
    }
}
