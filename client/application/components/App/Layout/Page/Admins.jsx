import React from 'react';
import useAdmins from 'hooks/graphql/queries/admin/admins';
import useToggle from 'hooks/useToggle';
import Button from 'atoms/Button';
import Loading from 'molecules/Loading';
import EmptyState from 'molecules/EmptyState';

const Admins = () => {
    const { data, loading } = useAdmins();
    const [isAdminEditorOpen, openAdminEditor, closeAdminEditor] = useToggle(false);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (data.users.length === 0) {
        return (
            <EmptyState
                action={(
                    <Button onClick={openAdminEditor}>Admin erstellen</Button>
                )}
                text="Leg hier deinen ersten Admin an!"
                title="Es sind noch keine Admins angelegt worden."
            />
        );
    }

    return (
        <div className="admins">
            <div className="admins__list">
                {data.users.map((user) => (
                    <div
                        key={user.id}
                        className="admins__item"
                    >
                        {user.firstName}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admins;
