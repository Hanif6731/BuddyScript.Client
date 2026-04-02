import React, { useReducer } from 'react';
import { headerSearchReducer, initialState } from './HeaderSearch.reducer';
import { searchInput, submitSearch } from './HeaderSearch.actions';

const HeaderSearch: React.FC = () => {
    const [state, dispatch] = useReducer(headerSearchReducer, initialState);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(searchInput(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(submitSearch());
        console.log('Searching for:', state.searchValue);
    };

    return (
        <div className="_header_form ms-auto">
            <form className="_header_form_grp" onSubmit={handleSubmit}>
                <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                    <circle cx="7" cy="7" r="6" stroke="#666" />
                    <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                </svg>
                <input 
                    className="form-control me-2 _inpt1" 
                    type="search" 
                    placeholder="input search text" 
                    aria-label="Search" 
                    value={state.searchValue}
                    onChange={handleSearch}
                />
            </form>
        </div>
    );
};

export default HeaderSearch;
