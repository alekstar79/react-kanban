import searchIcon from '../../assets/icons/search.svg';
import './SearchBar.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-bar">
      <img className="search-bar__icon" src={searchIcon} alt="" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="поиск..."
        aria-label="Поиск задач"
      />
    </label>
  );
}
