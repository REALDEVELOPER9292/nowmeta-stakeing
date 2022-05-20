import React from "react";
import { Skeleton } from "antd";
import { timestampToDate, toLocalNumber } from "utils/util";
import Ribbon from "components/ribbon";
import Spinner from "components/spinner";
import './card.css';

const Card = ({ loading, stakedAmount, stakeTime, lastUpdateTime, claimable, onClaim, pending, onUnstake }) => {
    return (
        <div className="flex staking-card">
            <Skeleton paragraph={{ rows: 7 }} active loading={loading}>
                <Ribbon label={claimable} />
                <div className="flex col card-body">
                    <div className="flex">
                        <p className="flex stake-info-item">Staked amount: {toLocalNumber(stakedAmount, 8)}</p>
                    </div>
                    <div className="flex">
                        <p className="flex stake-info-item">Stake time: {timestampToDate(stakeTime)}</p>
                    </div>
                    <div className="flex">
                        <p className="flex stake-info-item">Last updated time: {timestampToDate(lastUpdateTime)}</p>
                    </div>
                </div>

                <div className="flex card-footer">
                    {
                        pending ? <Spinner /> : <>
                            <button className="flex card-button card-button-left" onClick={onClaim} disabled={claimable == 0 ? true : false}>Claim</button>
                            <button className="flex card-button card-button-right" onClick={onUnstake}>Unstake</button>
                        </>
                    }
                </div>
            </Skeleton>
        </div>
    )
}

export default Card;