import React, { useReducer } from 'react';
import { notificationDropdownReducer, initialState } from './NotificationDropdown.reducer';
import { toggleMoreOptions } from './NotificationDropdown.actions';

const NotificationDropdown: React.FC = () => {
    const [state, dispatch] = useReducer(notificationDropdownReducer, initialState);

    const handleToggleMore = () => {
        dispatch(toggleMoreOptions());
    };

    const renderNotification = (img: string, name: string, text: string, time: string, groupName?: string) => (
        <div className="_notification_box">
            <div className="_notification_image">
                <img src={img} alt="Image" className="_notify_img" />
            </div>
            <div className="_notification_txt">
                <p className="_notification_para">
                    {groupName ? (
                        <>
                            An admin changed the name of the group 
                            <span className="_notify_txt_link"> {groupName} </span>
                            to
                            <span className="_notify_txt_link"> {groupName} </span>
                        </>
                    ) : (
                        <>
                            <span className="_notify_txt_link"> {name} </span>
                            {text}
                        </>
                    )}
                </p>
                <div className="_nitification_time">
                    <span>{time}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div id="_notify_drop" className="_notification_dropdown">
            <div className="_notifications_content">
                <h4 className="_notifications_content_title">Notifications</h4>
                <div className="_notification_box_right">
                    <button type="button" className="_notification_box_right_link" onClick={handleToggleMore}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                            <circle cx="2" cy="2" r="2" fill="#C4C4C4"></circle>
                            <circle cx="2" cy="8" r="2" fill="#C4C4C4"></circle>
                            <circle cx="2" cy="15" r="2" fill="#C4C4C4"></circle>
                        </svg>
                    </button>
                    <div className={`_notifications_drop_right ${state.isMoreOptionsShow ? 'show' : ''}`}>
                        <ul className="_notification_list">
                            <li className="_notification_item">
                                <span className="_notification_link">Mark as all read</span>
                            </li>
                            <li className="_notification_item">
                                <span className="_notification_link">Notifivations seetings</span>
                            </li>
                            <li className="_notification_item">
                                <span className="_notification_link">Open Notifications</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="_notifications_drop_box">
                <div className="_notifications_drop_btn_grp">
                    <button className="_notifications_btn_link">
                        All
                    </button>
                    <button className="_notifications_btn_link1">
                        Unread
                    </button>
                </div>
                <div className="_notifications_all">
                    {renderNotification("/assets/images/friend-req.png", "Steve Jobs", "posted a link in your timeline.", "42 miniutes ago")}
                    {renderNotification("/assets/images/profile-1.png", "", "", "42 miniutes ago", "Freelacer usa")}
                    {renderNotification("/assets/images/friend-req.png", "Steve Jobs", "posted a link in your timeline.", "42 miniutes ago")}
                    {renderNotification("/assets/images/profile-1.png", "", "", "42 miniutes ago", "Freelacer usa")}
                    {renderNotification("/assets/images/friend-req.png", "Steve Jobs", "posted a link in your timeline.", "42 miniutes ago")}
                    {renderNotification("/assets/images/profile-1.png", "", "", "42 miniutes ago", "Freelacer usa")}
                    {renderNotification("/assets/images/friend-req.png", "Steve Jobs", "posted a link in your timeline.", "42 miniutes ago")}
                    {renderNotification("/assets/images/profile-1.png", "", "", "42 miniutes ago", "Freelacer usa")}
                    {renderNotification("/assets/images/friend-req.png", "Steve Jobs", "posted a link in your timeline.", "42 miniutes ago")}
                    {renderNotification("/assets/images/profile-1.png", "", "", "42 miniutes ago", "Freelacer usa")}
                    {renderNotification("/assets/images/friend-req.png", "Steve Jobs", "posted a link in your timeline.", "42 miniutes ago")}
                    {renderNotification("/assets/images/profile-1.png", "", "", "42 miniutes ago", "Freelacer usa")}
                    {renderNotification("/assets/images/friend-req.png", "Steve Jobs", "posted a link in your timeline.", "42 miniutes ago")}
                    {renderNotification("/assets/images/profile-1.png", "", "", "42 miniutes ago", "Freelacer usa")}
                    {renderNotification("/assets/images/friend-req.png", "Steve Jobs", "posted a link in your timeline.", "42 miniutes ago")}
                    {renderNotification("/assets/images/profile-1.png", "", "", "42 miniutes ago", "Freelacer usa")}
                    {renderNotification("/assets/images/friend-req.png", "Steve Jobs", "posted a link in your timeline.", "42 miniutes ago")}
                    {renderNotification("/assets/images/profile-1.png", "", "", "42 miniutes ago", "Freelacer usa")}
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;
