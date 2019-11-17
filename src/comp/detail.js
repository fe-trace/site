import React from 'react';
import md from './../../md/webpack/loader.md';
import {
    useParams
} from "react-router-dom";

export default function detail(props) {
    const payload = useParams();
    const [ html, setHtml ] = React.useState(null);

    React.useEffect(function() {
        import(`./../../md/webpack/${payload.id}`).then((html) => {
            setHtml(html.default);
        })
    });

    console.log(payload);
    return (
        <div className="detail-page">
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}