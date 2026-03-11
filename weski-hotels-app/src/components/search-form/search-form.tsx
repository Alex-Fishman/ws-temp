import React, {useState} from "react";
import "./search-form.scss";
import ResortsSelect from "./resorts-select/resorts-select";
import GuestsSelect from "./guests-select/guests-select";
import SearchButton from "./search-button/search-button";
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import { searchHotels, Hotel } from '../../api/hotels';

const SearchForm: React.FC = () => {
    const [skiSiteId, setSkiSiteId] = useState<number>(1);
    const [groupSize, setGroupSize] = useState<number>(1);
    const [startDate, setStartDate] = useState<Date | null>(dayjs().toDate());
    const [endDate, setEndDate] = useState<Date | null>(dayjs().add(7, 'days').toDate());
    const [results, setResults] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        setError(null);
        try {
            const hotels = await searchHotels({
                resortId: String(skiSiteId),
                groupSize,
                startDate: dayjs(startDate).format('YYYY-MM-DD'),
                endDate: dayjs(endDate).format('YYYY-MM-DD'),
            });
            setResults(hotels);
        } catch {
            setError('Could not load hotels. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-form">
            <ResortsSelect value={skiSiteId} onChange={skiSiteId => setSkiSiteId(skiSiteId)} />
            <GuestsSelect value={groupSize} onChange={groupSize => setGroupSize(groupSize)} />

            <DatePicker className="search-form-date-picker" selected={startDate} onChange={(date) => setStartDate(date)} enableTabLoop={false} />
            <DatePicker className="search-form-date-picker" selected={endDate} onChange={(date) => setEndDate(date)} enableTabLoop={false} />

            <SearchButton onClick={handleSearch} />

            {loading && <p>Loading...</p>}
            {error && <p className="search-form-error">{error}</p>}
            {results.length > 0 && (
                <ul className="search-form-results">
                    {results.map(hotel => (
                        <li key={hotel.id}>
                            {hotel.name} — €{hotel.pricePerNight}/night (up to {hotel.maxGuests} guests)
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchForm;