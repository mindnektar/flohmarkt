import React from 'react';
import moment from 'moment';
import useMarkets from 'hooks/graphql/queries/admin/markets';
import useToggle from 'hooks/useToggle';
import Button from 'atoms/Button';
import List, { ListItem } from 'molecules/List';
import Content from 'organisms/Content';
import CreateAndUpdate from 'editors/markets/CreateAndUpdate';

const Markets = () => {
    const { data, loading } = useMarkets();
    const [isMarketEditorOpen, openMarketEditor, closeMarketEditor] = useToggle(false);

    const renderAction = () => (
        <>
            <Button onClick={openMarketEditor}>Flohmarkt erstellen</Button>

            <CreateAndUpdate
                close={closeMarketEditor}
                isOpen={isMarketEditorOpen}
            />
        </>
    );

    const renderContent = () => (
        <List>
            {data.markets
                .toSorted((a, b) => moment(b.startDate).diff(a.startDate))
                .map((market) => (
                    <ListItem
                        key={market.id}
                        label={market.name}
                        subLabel={`${moment(market.startDate).format('L')} - ${moment(market.endDate).format('L')}`}
                    >
                        {market.name}
                    </ListItem>
                ))}
        </List>
    );

    return (
        <Content
            action={renderAction()}
            emptyState={{
                condition: data?.markets.length === 0,
                text: 'Leg hier deinen ersten Flohmarkt an!',
                title: 'Es sind noch keine Flohmärkte angelegt worden.',
            }}
            headline="Flohmärkte"
        >
            {!loading && renderContent()}
        </Content>
    );
};

export default Markets;
