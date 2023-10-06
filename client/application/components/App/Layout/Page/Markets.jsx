import React from 'react';
import useMarkets from 'hooks/graphql/queries/markets';
import Loading from 'molecules/Loading';

const Markets = () => {
    const { data, loading } = useMarkets();

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="markets">
            <div className="markets__list">
                {data.markets.map((market) => (
                    <div
                        key={market.id}
                        className="markets__item"
                    >
                        {market.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Markets;
