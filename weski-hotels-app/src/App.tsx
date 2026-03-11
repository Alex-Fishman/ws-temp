import { useEffect, useRef, useState } from 'react';
import NavBar from './components/navbar/nav-bar';
import ResultsSection, { SearchContext } from './components/results-section/results-section';
import { streamHotels, Hotel } from './api/hotels';
import { resorts } from './components/search-form/resorts-select/resorts-select';
import dayjs from 'dayjs';

export default function App() {
    const [skiSiteId, setSkiSiteId] = useState<number>(1);
    const [groupSize, setGroupSize] = useState<number>(1);
    const [startDate, setStartDate] = useState<Date | null>(dayjs().toDate());
    const [endDate, setEndDate] = useState<Date | null>(dayjs().add(7, 'days').toDate());

    const [results, setResults] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchContext, setSearchContext] = useState<SearchContext | null>(null);

    const cancelStream = useRef<(() => void) | null>(null);

    useEffect(() => {
        return () => cancelStream.current?.();
    }, []);

    const handleSearch = () => {
        if (!startDate || !endDate) return;

        cancelStream.current?.();
        setResults([]);
        setLoading(true);
        setError(null);

        const resortName = resorts.find(r => r.id === skiSiteId)?.name ?? '';
        setSearchContext({
            resortName,
            startDate: dayjs(startDate).format('YYYY-MM-DD'),
            endDate: dayjs(endDate).format('YYYY-MM-DD'),
            groupSize,
        });

        const cancel = streamHotels(
            {
                skiSiteId,
                groupSize,
                startDate: dayjs(startDate).format('YYYY-MM-DD'),
                endDate: dayjs(endDate).format('YYYY-MM-DD'),
            },
            (batch) => {
                setResults((prev) => {
                    const merged = [...prev, ...batch];
                    merged.sort((a, b) => a.pricePerNight - b.pricePerNight);
                    return merged;
                });
            },
            () => setLoading(false),
            () => {
                setError('Could not load hotels. Please try again.');
                setLoading(false);
            },
        );

        cancelStream.current = cancel;
    };

    return (
        <div className="app">
            <NavBar
                skiSiteId={skiSiteId} onSkiSiteIdChange={setSkiSiteId}
                groupSize={groupSize} onGroupSizeChange={setGroupSize}
                startDate={startDate} onStartDateChange={setStartDate}
                endDate={endDate} onEndDateChange={setEndDate}
                onSearch={handleSearch}
            />
            {searchContext && (
                <ResultsSection
                    results={results}
                    loading={loading}
                    error={error}
                    searchContext={searchContext}
                />
            )}
        </div>
    );
}
