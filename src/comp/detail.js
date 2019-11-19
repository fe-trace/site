import React from 'react';
import md from './../../md/webpack/loader.md';
import {
    useParams
} from "react-router-dom";

export default function detail() {
    const payload = useParams();
    const [ html, setHtml ] = React.useState(null);

    React.useEffect(function() {
        import(`./../../md/${payload.tag}/${payload.name}`).then((html) => {
            setHtml(html.default);
        })
    });

    return (
        <div className="detail-page">
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}