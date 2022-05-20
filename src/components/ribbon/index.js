import React from 'react';
import { toLocalNumber } from 'utils/util';
import './ribbon.css';

const Ribbon = ({ label }) => {
    return (
        <div className="ribbon ribbon-top-left">
            <span style={label == 0 ? { backgroundColor: 'crimson' } : { backgroundColor: '#3498db' }}>
                {label == 0 ? "Pending..." : `Claimable`}
            </span>
        </div>
    )
}

export default Ribbon;