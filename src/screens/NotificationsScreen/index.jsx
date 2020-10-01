import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

import ScreenTitle from '../../components/ScreenTitle';
import LoadingSpinner from '../../components/LoadingSpinner';
import { notificationsRef } from '../../firebase/firebase.utils';
import Grid from '../../components/Grid';
import Card from '../../components/Card';

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let listener = null;

        const fetchNotificationsList = async () => {
            listener = notificationsRef.on('value', listSnapshot => {

                const notificationsData = [];

                listSnapshot.forEach(snapshot => {
                    notificationsData.push({
                        id: snapshot.key,
                        ...snapshot.val()
                    });
                });

                setNotifications(notificationsData);
                setLoading(false);
            });
        }

        fetchNotificationsList();

        return () => {
            if (listener) {
                notificationsRef.off('value', listener);
            }
        };
    }, []);

    const renderedCards = notifications.map(notification => {
        const localDateString = new Date(notification.createdAt).toLocaleString("en-IN", {
            hour12: true,
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            weekday: "short",
        });
        return (
            <Card key={notification.id} className={styles['notification-card']}>
                <h4>{notification.title}</h4>
                <small>{localDateString}</small>
                <p>{notification.content}</p>
            </Card>
        );
    });

    return (
        <div className={styles['notifications-screen']}>
            <ScreenTitle>NOTIFICATIONS</ScreenTitle>
            {loading && (
                <LoadingSpinner asOverlay />
            )}
            {!loading && (
                <Grid className={styles['grid']}>
                    {renderedCards}
                </Grid>
            )}
        </div>
    );
};

export default NotificationsScreen;