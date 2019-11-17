import React from 'react';
import moment from 'moment';
import './../css/home.less';
import json from './../json/home.js';
export default function home(props) {
    const list = json.fileList;

    return (
        <div className="home-page">
            {
                list.map(function(item, index) {
                    return (
                        <div className="block" key={index}>
                            <div className="title">
                                <a>{item.name}</a>
                            </div>
                            <div className="meta">{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                        </div>
                    );
                })
            }
        </div>
    );
}