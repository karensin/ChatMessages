import React from 'react';
import { messages } from '../data.json';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

export default function MessageList() {
    const USE_JSON_FILTER = true;
    const messageSet = new Set([]);

    const uuids = {};


    //filter duplicates 
    // I came up with 2 different approaches to do filtering feature 

    const dedupeMessages = messages => {
        //Using JSON.Stringify to serialize each message's uuid and content into a unique format and a Set to dedup 
        //benefit of this approach is that serializing objects is a standard practice 
        if (USE_JSON_FILTER) {
            return messages.filter((message) => {
                const data = {
                    uuid: message.uuid,
                    content: message.content
                }
                const jsonData = JSON.stringify(data)
                if (messageSet.has(jsonData)) {
                    return false
                } else {
                    messageSet.add(jsonData)
                    return true
                }
            })
        } else {
            //using uuid in a Hashmap and a Set for the content to dedupe
            //this approaching is explicitly targeting uuids and contents in seperate data structures, this keeps the type constant instead of converting the 2 fields into a string 
            return messages.filter((message) => {
                if (!('uuid' in uuids)) {
                    uuids.uuid = new Set([])
                    uuids.uuid.add(message.content)
                    return true
                } else if ('uuid' in uuids) {
                    if (!(uuids.uuid.has(message.content))) {
                        uuids.uuid.add(message.content)
                        return true
                    }
                }
                else return false
            })
        }
    }
    const filtered = dedupeMessages(messages)


    //Time formatting into human-readable string "DayOfTheWeek Month Day, Year at Time" 

    function timeFormatter(cell, row) {
        let getTime = new Date(cell);
        let time = getTime.toLocaleString(undefined, {
            weekday: 'short',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        return time
    }

    const options = {
        defaultSortName: 'sentAt',
        sortIndicator: true, // disable sort indicator
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }, {
            text: '20', value: 20
        }, {
            text: 'All', value: filtered.length
        }],
        sizePerPage: 5,
    };

    //extra feature: selecting and highlighting row(s) 
    const selectRowProp = {
        mode: 'checkbox',
        bgColor: '#95A7E2'
    };


    //mapping and applying unique keys to each row
    const result = filtered.map(item => {
        return { ...item, uuid: uuidv4() }
    })

    return (
        <Container>
            <Row>
                <Col>
                    <BootstrapTable data={result} height='auto' maxHeight='500px' pagination={true} striped hover options={options} selectRow={selectRowProp} deleteRow={true}>
                        <TableHeaderColumn isKey dataField='uuid' hidden> uuidv </TableHeaderColumn>
                        <TableHeaderColumn dataField='senderUuid'> From (Sender ID)</TableHeaderColumn>
                        <TableHeaderColumn dataField='content'> Message Content</TableHeaderColumn>
                        <TableHeaderColumn dataField='sentAt' dataSort={true} dataFormat={timeFormatter}
                        >Send Time</TableHeaderColumn >
                    </BootstrapTable >
                </Col>
            </Row>
        </Container>
    )
}

