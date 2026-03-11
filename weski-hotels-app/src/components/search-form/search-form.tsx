import React from "react";
import "./search-form.scss";
import ResortsSelect from "./resorts-select/resorts-select";
import GuestsSelect from "./guests-select/guests-select";
import SearchButton from "./search-button/search-button";
import DatePicker from 'react-datepicker';

interface Props {
    skiSiteId: number;
    onSkiSiteIdChange: (id: number) => void;
    groupSize: number;
    onGroupSizeChange: (size: number) => void;
    startDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    endDate: Date | null;
    onEndDateChange: (date: Date | null) => void;
    onSearch: () => void;
}

const SearchForm: React.FC<Props> = ({
    skiSiteId, onSkiSiteIdChange,
    groupSize, onGroupSizeChange,
    startDate, onStartDateChange,
    endDate, onEndDateChange,
    onSearch,
}) => {
    return (
        <div className="search-form">
            <ResortsSelect value={skiSiteId} onChange={onSkiSiteIdChange} />
            <GuestsSelect value={groupSize} onChange={onGroupSizeChange} />
            <DatePicker className="search-form-date-picker" selected={startDate} onChange={onStartDateChange} enableTabLoop={false} />
            <DatePicker className="search-form-date-picker" selected={endDate} onChange={onEndDateChange} enableTabLoop={false} />
            <SearchButton onClick={onSearch} />
        </div>
    );
}

export default SearchForm;
