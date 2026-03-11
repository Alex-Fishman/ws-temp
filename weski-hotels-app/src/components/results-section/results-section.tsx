import './results-section.scss';
import { useState } from 'react';
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

const STAR_OPTIONS = [1, 2, 3, 4, 5];

export default function ResultsSection({ results, loading, error, searchContext }: Props) {
    const [minRating, setMinRating] = useState<number | null>(null);

    const filtered = minRating !== null ? results.filter(h => h.rating >= minRating) : results;

    const formattedStart = dayjs(searchContext.startDate).format('MMM D');
    const formattedEnd = dayjs(searchContext.endDate).format('MMM D');
    const peopleLabel = searchContext.groupSize === 1 ? 'person' : 'people';
    const subtitle = `${filtered.length} ski trips options • ${searchContext.resortName} • ${formattedStart} - ${formattedEnd} • ${searchContext.groupSize} ${peopleLabel}`;

    return (
        <div className="results-section">
            {loading && <div className="results-section__progress-bar" />}
            <div className="results-section__header">
                <h1 className="results-section__title">Select your ski trip</h1>
                <p className="results-section__subtitle">{subtitle}</p>
            </div>
            <div className="results-section__filters">
                <span className="results-section__filter-label">Min rating:</span>
                {STAR_OPTIONS.map(star => (
                    <button
                        key={star}
                        className={`results-section__filter-btn${minRating === star ? ' results-section__filter-btn--active' : ''}`}
                        onClick={() => setMinRating(prev => prev === star ? null : star)}
                    >
                        {'★'.repeat(star)}
                    </button>
                ))}
            </div>
            {error ? <p className="results-section__error">{error}</p> : null}
            <div className="results-section__list">
                {results.length > 0
                    ? filtered.map(hotel => (
                        <HotelCard key={hotel.id} hotel={hotel} resortName={searchContext.resortName} />
                    ))
                    : skeletonCards
                }
            </div>
        </div>
    );
}
