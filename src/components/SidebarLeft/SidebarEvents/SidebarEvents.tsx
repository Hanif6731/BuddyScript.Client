import React, { useReducer } from 'react';
import { sidebarEventsReducer, initialState } from './SidebarEvents.reducer';
import { toggleGoing } from './SidebarEvents.actions';

const SidebarEvents: React.FC = () => {
    const [state, dispatch] = useReducer(sidebarEventsReducer, initialState);

    const handleToggleGoing = (id: number) => {
        dispatch(toggleGoing(id));
    };

    const events = [
        { id: 1, title: 'No more terrorism no more cry', date: '10', month: 'Jul', going: 17, img: '/assets/images/feed_event1.png' },
        { id: 2, title: 'No more terrorism no more cry', date: '10', month: 'Jul', going: 17, img: '/assets/images/feed_event1.png' }
    ];

    return (
        <div className="_layout_left_sidebar_inner">
            <div className="_left_inner_area_event _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                <div className="_left_inner_event_content">
                    <h4 className="_left_inner_event_title _title5">Events</h4>
                    <a href="event.html" className="_left_inner_event_link">
                        See all
                    </a>
                </div>
                
                {events.map(event => (
                    <a className="_left_inner_event_card_link" href="event-single.html" key={event.id} onClick={(e) => e.preventDefault()}>
                        <div className="_left_inner_event_card">
                            <div className="_left_inner_event_card_iamge">
                                <img src={event.img} alt="Image" className="_card_img" />
                            </div>
                            <div className="_left_inner_event_card_content">
                                <div className="_left_inner_card_date">
                                    <p className="_left_inner_card_date_para">{event.date}</p>
                                    <p className="_left_inner_card_date_para1">{event.month}</p>
                                </div>
                                <div className="_left_inner_card_txt">
                                    <h4 className="_left_inner_event_card_title">{event.title}</h4>
                                </div>
                            </div>
                            <hr className="_underline" />
                            <div className="_left_inner_event_bottom">
                                <p className="_left_iner_event_bottom">{state.goingIds.includes(event.id) ? event.going + 1 : event.going} People Going</p> 
                                <span 
                                    className="_left_iner_event_bottom_link" 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleToggleGoing(event.id)}
                                >
                                    {state.goingIds.includes(event.id) ? 'Joined' : 'Going'}
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SidebarEvents;
