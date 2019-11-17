import React from 'react';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import './../css/home.less';
import json from './../json/home.js';

export default function home(props) {
    const history = useHistory();
    const list = json.fileList;
    const handleCick = function(url) {
        history.push(`/${url}`);
    };

    return (
        <div className="home-page">
            {
                list.map(function(item, index) {
                    return (
                        <div className="block" key={index}>
                            <div className="title">
                                <a onClick={() => {handleCick(item.name)}}>{item.name}</a>
                            </div>
                            <div className="meta">{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                        </div>
                    );
                })
            }
        </div>
    );
}