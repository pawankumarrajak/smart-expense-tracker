import {
  useEffect,
  useId,
  useRef,
  useState
} from "react";

function CustomSelect({
  label,
  value,
  options = [],
  onChange,
  disabled = false,
  id,
  className = ""
}) {
  const generatedId = useId();
  const selectId = id || generatedId;

  const labelId = `${selectId}-label`;
  const menuId = `${selectId}-menu`;

  const containerRef = useRef(null);
  const optionRefs = useRef([]);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] =
    useState(-1);

  const selectedIndex = options.findIndex(
    (option) => option.value === value
  );

  const selectedOption =
    selectedIndex >= 0
      ? options[selectedIndex]
      : options[0] || null;

  /*
   * -------------------------------------------------------
   * CLOSE WHEN CLICKING OUTSIDE
   * -------------------------------------------------------
   */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
   * -------------------------------------------------------
   * CLOSE WHEN DISABLED
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }, [disabled]);

  /*
   * -------------------------------------------------------
   * SET HIGHLIGHTED OPTION WHEN OPENING
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setHighlightedIndex(
      selectedIndex >= 0
        ? selectedIndex
        : options.length > 0
        ? 0
        : -1
    );
  }, [isOpen, selectedIndex, options.length]);

  /*
   * -------------------------------------------------------
   * FOCUS HIGHLIGHTED OPTION
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) {
      return;
    }

    const optionElement =
      optionRefs.current[highlightedIndex];

    if (optionElement) {
      optionElement.focus();
    }
  }, [highlightedIndex, isOpen]);

  /*
   * -------------------------------------------------------
   * SELECT OPTION
   * -------------------------------------------------------
   */

  const handleOptionClick = (option) => {
    if (disabled) {
      return;
    }

    if (typeof onChange === "function") {
      onChange(option.value);
    }

    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  /*
   * -------------------------------------------------------
   * TOGGLE DROPDOWN
   * -------------------------------------------------------
   */

  const handleToggle = () => {
    if (disabled || options.length === 0) {
      return;
    }

    setIsOpen((previous) => !previous);
  };

  /*
   * -------------------------------------------------------
   * KEYBOARD NAVIGATION
   * -------------------------------------------------------
   */

  const handleTriggerKeyDown = (event) => {
    if (disabled || options.length === 0) {
      return;
    }

    switch (event.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        event.preventDefault();

        setIsOpen(true);

        setHighlightedIndex(
          selectedIndex >= 0
            ? selectedIndex
            : 0
        );

        break;

      case "ArrowUp":
        event.preventDefault();

        setIsOpen(true);

        setHighlightedIndex(
          selectedIndex >= 0
            ? selectedIndex
            : options.length - 1
        );

        break;

      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
        }

        break;

      default:
        break;
    }
  };

  const handleOptionKeyDown = (
    event,
    index
  ) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setHighlightedIndex(
          Math.min(
            index + 1,
            options.length - 1
          )
        );

        break;

      case "ArrowUp":
        event.preventDefault();

        if (index === 0) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        } else {
          setHighlightedIndex(index - 1);
        }

        break;

      case "Enter":
      case " ":
        event.preventDefault();

        if (options[index]) {
          handleOptionClick(options[index]);
        }

        break;

      case "Escape":
        event.preventDefault();

        setIsOpen(false);
        setHighlightedIndex(-1);

        break;

      case "Home":
        event.preventDefault();

        setHighlightedIndex(0);

        break;

      case "End":
        event.preventDefault();

        setHighlightedIndex(
          options.length - 1
        );

        break;

      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`custom-select-field ${className}`.trim()}
    >
      {label && (
        <label
          id={labelId}
          className="custom-select-label"
          htmlFor={selectId}
        >
          {label}
        </label>
      )}

      <div className="custom-select">
        <button
          id={selectId}
          type="button"
          className={`custom-select-trigger ${
            isOpen ? "is-open" : ""
          }`}
          onClick={handleToggle}
          onKeyDown={handleTriggerKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={
            isOpen ? menuId : undefined
          }
          aria-labelledby={
            label
              ? labelId
              : undefined
          }
        >
          <span className="custom-select-value">
            {selectedOption?.label ||
              "Select an option"}
          </span>

          <span
            className={`custom-select-arrow ${
              isOpen ? "is-open" : ""
            }`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>

        {isOpen && (
          <div
            id={menuId}
            className="custom-select-menu"
            role="listbox"
            aria-labelledby={
              label ? labelId : undefined
            }
          >
            {options.map((option, index) => {
              const isSelected =
                option.value === value;

              const isHighlighted =
                index === highlightedIndex;

              return (
                <button
                  key={option.value}
                  ref={(element) => {
                    optionRefs.current[index] =
                      element;
                  }}
                  type="button"
                  className={`custom-select-option ${
                    isSelected
                      ? "is-selected"
                      : ""
                  } ${
                    isHighlighted
                      ? "is-highlighted"
                      : ""
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={
                    isHighlighted ? 0 : -1
                  }
                  onClick={() =>
                    handleOptionClick(option)
                  }
                  onKeyDown={(event) =>
                    handleOptionKeyDown(
                      event,
                      index
                    )
                  }
                  onMouseEnter={() =>
                    setHighlightedIndex(index)
                  }
                >
                  <span>
                    {option.label}
                  </span>

                  {isSelected && (
                    <span
                      className="custom-select-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomSelect;