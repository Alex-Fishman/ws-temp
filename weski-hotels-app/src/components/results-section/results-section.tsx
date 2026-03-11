import './results-section.scss';
import { Hotel } from '../../api/hotels';
import dayjs from 'dayjs';
import HotelCard, { skeletonCards } from './hotel-card';

export interface SearchContext {
    resortName: string;
    startDate: string;
    endDate: string;
    groupSize: number;
}

interface Props {
    results: Hotel[];
    loading: boolean;
    error: string | null;
    searchContext: SearchContext;
}

export default function ResultsSection({ results, loading, error, searchContext }: Props) {
    const formattedStart = dayjs(searchContext.startDate).format('MMM D');
    const formattedEnd = dayjs(searchContext.endDate).format('MMM D');
    const peopleLabel = searchContext.groupSize === 1 ? 'person' : 'people';
    const subtitle = `${results.length} ski trips options • ${searchContext.resortName} • ${formattedStart} - ${formattedEnd} • ${searchContext.groupSize} ${peopleLabel}`;

    return (
        <div className="results-section">
            <div className="results-section__header">
                <h1 className="results-section__title">Select your ski trip</h1>
                <p className="results-section__subtitle">{subtitle}</p>
            </div>
            {error ? <p className="results-section__error">{error}</p> : null}
            <div className="results-section__list">
                {results.map(hotel => (
                    <HotelCard key={hotel.id} hotel={hotel} resortName={searchContext.resortName} />
                ))}
                {loading ? skeletonCards : null}
            </div>
        </div>
    );
}
