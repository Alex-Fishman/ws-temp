import "./nav-bar.scss";
import WeSkiLogo from "../weski-logo/weski-logo";
import SearchForm from "../search-form/search-form";

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

export default function NavBar(props: Props) {
    return (
        <div className="nav-bar">
            <WeSkiLogo />
            <SearchForm {...props} />
        </div>
    );
}
