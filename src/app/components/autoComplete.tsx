import { ListGroup, TextInput } from "flowbite-react";
import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { IoIosArrowDown, IoIosSearch, IoIosClose } from "react-icons/io";
import { Menu } from "../common";

interface AutoCompleteProps {
  /** Array of items to display in the dropdown */
  items: Menu[] | string[] | number[];
  /** Key to use for display and filtering when items are objects */
  displayKey?: string;
  /** Key to use for the value when items are objects */
  valueKey?: string;
  /** Function called when an item is selected */
  onSelect?: (item: (Menu | string | number)) => void;
  /** Default value for the input */
  defaultValue?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Label for the input */
  label?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Custom render function for list items */
  renderItem?: (item: Menu | string | number) => ReactNode;
  /** Custom filter function */
  filterFunction?: (item: Menu | string | number, query: string) => boolean;
  /** Additional CSS classes for the component */
  className?: string;
  /** ID for the input element */
  id?: string;
  /** No results message */
  noResultsMessage?: string;
  /** Maximum height of the dropdown in pixels */
  maxHeight?: number;
  /** Whether to clear the input on selection */
  clearOnSelect?: boolean;
}

function AutoComplete({
  items = [] as Menu[],
  displayKey = '',
  onSelect,
  defaultValue = '',
  placeholder = 'Select an option',
  label,
  disabled = false,
  renderItem,
  filterFunction,
  className = '',
  id: externalId,
  noResultsMessage = 'No results found',
  maxHeight = 250,
  clearOnSelect = false,
}: AutoCompleteProps) {
  const generatedId = useId();
  const id = externalId || `autocomplete-${generatedId}`;
  const listId = `${id}-list`;
  
  const [showList, setShowList] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [filteredItems, setFilteredItems] = useState<(Menu | string | number)[]>(items);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const componentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Default filter function
  const defaultFilterFn = (item: Menu | string | number, query: string) => {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    if (typeof item === 'string' || typeof item === 'number') {
      return String(item).toLowerCase().includes(lowerQuery);
    }
    if (displayKey && item[displayKey]) {
      return String(item[displayKey]).toLowerCase().includes(lowerQuery);
    }
    return false;
  };
  
  const filterFn = filterFunction || defaultFilterFn;
  
  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    
    // Filter items based on input value
    const filtered:(Menu | string | number)[] = items.filter(item => filterFn(item, value));
    setFilteredItems(filtered);
    
    // Show dropdown if we have input or filtered items
    setShowList(true);
  };
  
  // Get display value for an item
  const getDisplayValue = (item: (Menu | string | number)) => {
    if (item === null || item === undefined) return '';
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    if (displayKey && item[displayKey] !== undefined) return String(item[displayKey]);
    return String(item);
  };
  
  // Handle item selection
  const handleSelect = (item: (Menu | string | number)) => {
    if (!clearOnSelect) {
      setInputValue(getDisplayValue(item));
    } else {
      setInputValue('');
    }
    
    setShowList(false);
    
    if (onSelect) {
      onSelect(item);
    }
    
    // Return focus to input after selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Determine dropdown position based on available space
  const calculateDropdownPosition = () => {
    if (!inputRef.current) return;
    
    const inputRect = inputRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;
    
    // If there's not enough space below (less than 200px) and more space above, show dropdown above
    if (spaceBelow < 200 && spaceAbove > spaceBelow) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition('bottom');
    }
  };
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setShowList(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Add window resize listener to recalculate position
  useEffect(() => {
    const handleResize = () => {
      if (showList) {
        calculateDropdownPosition();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showList]);
  
  // Update filtered items when items prop changes
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);
  
  // Update input value when defaultValue changes
  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);
  
  return (
    <div ref={componentRef} className={`relative w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}
      
      <div className="relative">
        <TextInput
          id={id}
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            calculateDropdownPosition();
            setShowList(true);
          }}
          disabled={disabled}
          rightIcon={IoIosArrowDown}
          className="w-full focus:border-[#ff5a1f] focus:ring-[#ff5a1f]"
          autoComplete="off"
          color="custom"
          name="autocomplete"
          theme={{
            field: {
              input: {
                colors: {
                  custom: "border-gray-300 bg-white text-gray-900 focus:border-[#ff5a1f] focus:ring-[#ff5a1f]"
                }
              }
            }
          }}
        />
        
        {showList && (
          <div 
            id={listId}
            ref={dropdownRef}
            className={`absolute w-full ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-white border border-[#ff5a1f] border-opacity-20 rounded-lg shadow-lg z-50 overflow-hidden dark:bg-gray-700 dark:border-[#ff5a1f] dark:border-opacity-30`}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-700 p-2 border-b border-[#ff5a1f] border-opacity-20 dark:border-[#ff5a1f] dark:border-opacity-30">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <IoIosSearch className="text-[#ff5a1f] dark:text-[#ff5a1f]" />
                </div>
                {inputValue && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => {
                    setInputValue('');
                    setFilteredItems(items);
                  }}>
                    <IoIosClose className="text-gray-500 hover:text-[#ff5a1f] w-5 h-5" />
                  </div>
                )}
                <input
                  type="text"
                  className="block w-full p-2 pl-10 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#ff5a1f] focus:border-[#ff5a1f] dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#ff5a1f] dark:focus:border-[#ff5a1f]"
                  placeholder="Search"
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
              <ListGroup className="w-full rounded-none">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="text-left cursor-pointer transition-all duration-200 hover:bg-[#ff5a1f] hover:bg-opacity-10 hover:text-[#ff5a1f] hover:font-medium dark:hover:bg-[#ff5a1f] dark:hover:bg-opacity-20 dark:hover:text-[#ff5a1f]"
                      onClick={() => handleSelect(item)}
                    >
                      {renderItem ? renderItem(item) : getDisplayValue(item)}
                      {typeof item === 'object' && item.type && (
                        <span className="text-xs text-gray-500"> &nbsp;({item.type})</span>
                      )}
                    </ListGroup.Item>
                  ))    
                ) : (
                  <ListGroup.Item className="text-gray-500 dark:text-gray-400">
                    {noResultsMessage}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AutoComplete;