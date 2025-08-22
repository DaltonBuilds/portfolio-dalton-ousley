import React from 'react';

const KubernetesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" {...props}>
        <g fill="none" fillRule="evenodd">
            <path fill="#326CE5" d="M24 4L4 14v20l20 10 20-10V14L24 4zm16 29.8L24 41 8 33.8V16.2L24 9l16 7.2v17.6z"/>
            <path fill="#326CE5" d="M24 12l-12 5.4v13.2L24 36l12-5.4V17.4L24 12zm-8 8.8l8 3.6 8-3.6-8-3.6-8 3.6zm0 8.8l8 3.6 8-3.6v-7.2l-8 3.6-8-3.6v7.2z"/>
        </g>
    </svg>
);

export default KubernetesIcon;
