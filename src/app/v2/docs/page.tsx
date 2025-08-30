// src/app/v2/components/docs/page.tsx

"use client"; // This page will be interactive

import React, { useState } from 'react';
import Button from '../components/Button/Button'; // Import your custom Button component
import InputField from '../components/InputField/InputField';
import Dropdown from '../components/Dropdown/Dropdown';
import Checkbox from '../components/Checkbox/Checkbox'; // Import Checkbox
import RadioButton from '../components/RadioButton/RadioButton';
import ToggleSwitch from '../components/ToggleSwitch/ToggleSwitch';
import Card from '../components/Card/Card';
import Paragraph from '../components/Typography/Paragraph';
import Heading from '../components/Typography/Heading';
import Badge from '../components/Badge/Badge';
import FileUpload from '../components/FileUpload/FileUpload'; // Import FileUpload
import DatePicker from '../components/DatePicker/DatePicker'; // Import DatePicker


import { FaPlus, FaTrash, FaChevronRight, FaCheck, FaSearch, FaBuilding, FaGlobe, FaStar, FaTag, FaCalendarAlt } from 'react-icons/fa'; // Added icons for dropdown examples
import Calendar from '../components/Calendar/Calendar';
import dayjs from 'dayjs';



const ComponentsDocsPage: React.FC = () => {
  // State to manage input values for controlled components
  const [basicInputValue, setBasicInputValue] = useState('');
  const [clearInputValue, setClearInputValue] = useState('Initial Value'); // Value for clear example
  const [passwordValue, setPasswordValue] = useState('');

  // State to manage dropdown values
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedVariantOption, setSelectedVariantOption] = useState(null);
  const [selectedIconOption, setSelectedIconOption] = useState(null);
  const [selectedPanelWidthOption, setSelectedPanelWidthOption] = useState(null);
  const [selectedTemplateOption, setSelectedTemplateOption] = useState(null);

  // State for Checkbox examples
  const [basicChecked, setBasicChecked] = useState(false);
  const [primaryChecked, setPrimaryChecked] = useState(true); // Checked by default for severity examples
  const [secondaryChecked, setSecondaryChecked] = useState(true);
  const [successChecked, setSuccessChecked] = useState(true);
  const [infoChecked, setInfoChecked] = useState(true);
  const [warningChecked, setWarningChecked] = useState(true);
  const [dangerChecked, setDangerChecked] = useState(true);
  const [helpChecked, setHelpChecked] = useState(true);
  const [labelLeftChecked, setLabelLeftChecked] = useState(true);
  const [errorChecked, setErrorChecked] = useState(false);

  // State for Radio Button examples
  const [selectedFruit, setSelectedFruit] = useState('apple'); // State for a radio group
  const [selectedSeverity, setSelectedSeverity] = useState('primary'); // State for severity group

  // State for Toggle Switch examples
  const [basicToggleChecked, setBasicToggleChecked] = useState(false);
  const [primaryToggleChecked, setPrimaryToggleChecked] = useState(true);
  const [secondaryToggleChecked, setSecondaryToggleChecked] = useState(true);
  const [successToggleChecked, setSuccessToggleChecked] = useState(true);
  const [infoToggleChecked, setInfoToggleChecked] = useState(true);
  const [warningToggleChecked, setWarningToggleChecked] = useState(true);
  const [dangerToggleChecked, setDangerToggleChecked] = useState(true);
  const [helpToggleChecked, setHelpToggleChecked] = useState(true);
  const [labelLeftToggleChecked, setLabelLeftToggleChecked] = useState(true);
  const [disabledToggleChecked, setDisabledToggleChecked] = useState(true);
  const [disabledUncheckedToggleChecked, setDisabledUncheckedToggleChecked] = useState(false);


  // State for File Upload examples
  const [basicUploadFiles, setBasicUploadFiles] = useState<File[]>([]);
  const [multipleUploadFiles, setMultipleUploadFiles] = useState<File[]>([]);
  const [imageUploadFiles, setImageUploadFiles] = useState<File[]>([]);
  const [customLabelUploadFiles, setCustomLabelUploadFiles] = useState<File[]>([]);
  const [noFileListUploadFiles, setNoFileListUploadFiles] = useState<File[]>([]);
  // State for maxSize example (onSelect will only receive valid files)
  const [maxSizeUploadFiles, setMaxSizeUploadFiles] = useState<File[]>([]);

  // State for DatePicker examples
  const [selectedSingleDate, setSelectedSingleDate] = useState<Date | undefined>(undefined);
  const [selectedRange, setSelectedRange] = useState<undefined>(undefined);
  const [selectedMonthYear, setSelectedMonthYear] = useState<Date | undefined>(undefined);
  const [selectedYearOnly, setSelectedYearOnly] = useState<Date | undefined>(undefined);
  const [minMaxDate, setMinMaxDate] = useState<Date | undefined>(undefined);
  const [inlineDate, setInlineDate] = useState<Date | undefined>(undefined);
  const [dateWithError, setDateWithError] = useState<Date | undefined>(undefined);

  //State for Calender
  const [date, setDate] = useState<Date | string>(new Date('08/02/2025'))



  // Example options for the dropdown
  const cityOptions = [
    { label: 'New York', value: 'NY' },
    { label: 'London', value: 'LDN' },
    { label: 'Paris', value: 'PRS' },
    { label: 'Tokyo', value: 'TKO' },
  ];

  const variantOptions = [
    { label: 'Filled', value: 'filled' },
    { label: 'Outlined', value: 'outlined' },
    { label: 'Text', value: 'text' }
  ]

  const themedOptions = [
    { label: 'Primary', value: 'primary', icon: <FaBuilding className="text-primary" /> }, // Example with icon and themed text
    { label: 'Secondary', value: 'secondary', icon: <FaGlobe className="text-secondary" /> },
    { label: 'Success', value: 'success', icon: <FaCheck className="text-success" /> },
    // Add other severities
  ];
  // Example Option Template Function
  const CustomOptionTemplate = (option: any) => {
    return (
      <div className="flex items-center gap-2">
        {option.icon} {/* Render the icon from the option object */}
        <span>{option.label}</span> {/* Render the label */}
      </div>
    );
  };

  // Example Header with Image for Card
  const cardImageHeader = (
    <img alt="Card Header" src="https://primefaces.org/cdn/primereact/images/usercard.png" className="w-full h-48 object-cover" /> // Added styling for image
  );

  // Example Footer with Buttons for Card
  const cardFooterWithButtons = (
    <div className="flex justify-end gap-2"> {/* Use flex and gap for button spacing */}
      <Button severity="primary">Save</Button>
      <Button severity="secondary" variant="outlined">Cancel</Button> {/* Use custom button component */}
    </div>
  );

  const onSelectDate = (e) => {
    setDate(e);
  }

  return (
    <div className="container mx-auto p-8"> {/* Basic container styling */}
      <h1 className="text-3xl font-bold mb-8 text-foreground">Component Documentation</h1>

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Calendar
          minDate={dayjs("2000-01-01")}
          maxDate={dayjs("2026-12-31")}
          onSelect={(date) => console.log("Selected:", date?.format("YYYY-MM-DD"))}
          headerContent={<div className="text-lg font-bold">📅 Custom Header</div>}
          defaultValue={dayjs("2025-07-07")}
        />
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <DatePicker
          minDate={dayjs("2024-01-01")}
          maxDate={dayjs("2026-12-31")}
          value={dayjs("2025-08-28")}
          format="DD MMM YYYY"
          onChange={(date) => console.log("Picked:", date?.format("YYYY-MM-DD"))}
        />
      </div>

      {/* <section className='mb-12'>
        <Calendar onSelect={(e) => onSelectDate(e)} value={date} />
        {date?.toLocaleString()}
      </section> */}

      {/* Button Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Button</h2>

        {/* Filled Variants */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Filled Variants</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button severity="primary">Primary</Button>
            <Button severity="secondary">Secondary</Button>
            <Button severity="success">Success</Button>
            <Button severity="info">Info</Button>
            <Button severity="warning">Warning</Button>
            <Button severity="danger">Danger</Button>
            <Button severity="help">Help</Button>
            <Button severity="primary" disabled>Disabled</Button>
          </div>
        </div>

        {/* Outlined Variants */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Outlined Variants</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outlined" severity="primary">Primary</Button>
            <Button variant="outlined" severity="secondary">Secondary</Button>
            <Button variant="outlined" severity="success">Success</Button>
            <Button variant="outlined" severity="info">Info</Button>
            <Button variant="outlined" severity="warning">Warning</Button>
            <Button variant="outlined" severity="danger">Danger</Button>
            <Button variant="outlined" severity="help">Help</Button>
            <Button variant="outlined" severity="primary" disabled>Disabled</Button>
          </div>
        </div>

        {/* Text Variants */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Text Variants</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="text" severity="primary">Primary</Button>
            <Button variant="text" severity="secondary">Secondary</Button>
            <Button variant="text" severity="success">Success</Button>
            <Button variant="text" severity="info">Info</Button>
            <Button variant="text" severity="warning">Warning</Button>
            <Button variant="text" severity="danger">Danger</Button>
            <Button variant="text" severity="help">Help</Button>
            <Button variant="text" severity="primary" disabled>Disabled</Button>
          </div>
        </div>

        {/* Raised Variants */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Raised Variants</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="raised" severity="primary">Primary</Button>
            <Button variant="raised" severity="secondary">Secondary</Button>
            <Button variant="raised" severity="success">Success</Button>
            <Button variant="raised" severity="info">Info</Button>
            <Button variant="raised" severity="warning">Warning</Button>
            <Button variant="raised" severity="danger">Danger</Button>
            <Button variant="raised" severity="help">Help</Button>
            <Button variant="raised" severity="primary" disabled>Disabled</Button>
          </div>
        </div>


        {/* Size Variations */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        {/* Rounded Buttons */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Rounded</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button isRounded>Primary</Button>
            <Button severity="secondary" isRounded>Secondary</Button>
            <Button variant="outlined" severity="success" isRounded>Success</Button>
          </div>
        </div>

        {/* Buttons with Icons (You'll need actual icon components or elements) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Icons</h3>
          <div className="flex flex-wrap items-center gap-4">
            {/* Replace <svg> with your actual icon component or element */}
            <Button icon={<FaPlus />}>Add</Button>
            <Button icon={<FaTrash />} severity="danger">Delete</Button>
            <Button iconPosition="right" icon={<FaChevronRight />}>Next</Button>
            <Button icon={<FaCheck />} isRounded severity="success"></Button> {/* Icon only rounded button */}
          </div>
        </div>

      </section>

      {/* Input Field Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Input Field</h2>

        {/* Basic Input */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Basic Input</h3>
          <div className="w-64"> {/* Container for controlling width */}
            <InputField placeholder="Enter text" />
          </div>
        </div>

        {/* Input with Label */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Input with Label</h3>
          <div className="w-64">
            <InputField label="Username" placeholder="Enter your username" />
          </div>
        </div>

        {/* Input with Value (Controlled) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Input with Value</h3>
          <div className="w-64">
            <InputField
              label="Controlled Input"
              placeholder="Type something"
              value={basicInputValue}
              onChange={(e) => setBasicInputValue(e.target.value)}
            />
          </div>
        </div>


        {/* Input with Icon */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Input with Icon</h3>
          <div className="flex flex-wrap items-center gap-4">
            {/* Left Icon */}
            <div className="w-64">
              <InputField icon={<FaSearch />} placeholder="Search..." />
            </div>
            {/* Right Icon (If you have a different icon) */}
            {/* <div className="w-64">
                  <InputField icon={<FaCalendarAlt />} iconPosition="right" placeholder="Select date..." />
                </div> */}
          </div>
        </div>

        {/* Input with Clear Button */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Input with Clear Button</h3>
          <div className="w-64">
            <InputField
              label="Clearable Input"
              value={clearInputValue}
              onChange={(e) => setClearInputValue(e.target.value)}
              showClear
              placeholder="Type and clear"
            />
          </div>
        </div>


        {/* Password Input with Toggle */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Password Input</h3>
          <div className="w-64">
            <InputField
              label="Password"
              type="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Input with Error */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Input with Error</h3>
          <div className="w-64">
            <InputField
              label="Email Address"
              placeholder="Enter your email"
              error="Invalid email format"
            />
          </div>
        </div>

        {/* Disabled Input */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Disabled Input</h3>
          <div className="w-64">
            <InputField label="Disabled Input" placeholder="Cannot type here" disabled />
          </div>
        </div>


      </section>

      {/* Dropdown Component Showcase (Update and add examples) */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Dropdown</h2>

        {/* Basic Dropdown (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Basic Dropdown</h3>
          <div className="w-64">
            <Dropdown
              options={cityOptions}
              value={selectedOption}
              onChange={(value) => setSelectedOption(value)}
              placeholder="Select a City"
            />
          </div>
        </div>

        {/* Dropdown with Label (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Dropdown with Label</h3>
          <div className="w-64">
            <Dropdown
              label="Choose a City"
              options={cityOptions}
              value={selectedOption}
              onChange={(value) => setSelectedOption(value)}
              placeholder="Select a City"
            />
          </div>
        </div>

        {/* Dropdown with Different Variants (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Variants</h3>
          <div className="flex flex-wrap items-center gap-4">
            {/* Example: Filled Primary (default) */}
            <div className="w-40">
              <Dropdown
                options={cityOptions}
                value={selectedVariantOption}
                onChange={(value) => setSelectedVariantOption(value)}
                placeholder="Filled"
                variant="filled"
                severity="primary"
              />
            </div>

            {/* Example: Outlined Secondary */}
            <div className="w-40">
              <Dropdown
                options={cityOptions}
                value={selectedVariantOption}
                onChange={(value) => setSelectedVariantOption(value)}
                placeholder="Outlined"
                variant="outlined"
                severity="secondary"
              />
            </div>

            {/* Example: Text Success */}
            <div className="w-40">
              <Dropdown
                options={cityOptions}
                value={selectedVariantOption}
                onChange={(value) => setSelectedVariantOption(value)}
                placeholder="Text"
                variant="text"
                severity="success"
              />
            </div>
          </div>
        </div>

        {/* Dropdown with Icon */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Icon</h3>
          <div className="flex flex-wrap items-center gap-4">
            {/* Left Icon */}
            <div className="w-64">
              <Dropdown
                options={cityOptions}
                value={selectedIconOption}
                onChange={(value) => setSelectedIconOption(value)}
                placeholder="Select with Icon"
                icon={<FaGlobe />} // Use an icon component
                iconPosition="left"
              />
            </div>
            {/* Right Icon */}
            <div className="w-64">
              <Dropdown
                options={cityOptions}
                value={selectedIconOption}
                onChange={(value) => setSelectedIconOption(value)}
                placeholder="Select with Icon"
                icon={<FaBuilding />} // Use an icon component
                iconPosition="right"
              />
            </div>
          </div>
        </div>

        {/* Dropdown with Panel Width Control */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Panel Width</h3>
          <div className="flex flex-wrap items-center gap-4">
            {/* Auto Width (Default) */}
            <div className="w-64">
              <Dropdown
                options={cityOptions}
                value={selectedPanelWidthOption}
                onChange={(value) => setSelectedPanelWidthOption(value)}
                placeholder="Auto Width"
                panelWidth="auto" // Explicitly set to auto (default)
              />
            </div>

            {/* Full Width */}
            <div className="w-64">
              <Dropdown
                options={cityOptions}
                value={selectedPanelWidthOption}
                onChange={(value) => setSelectedPanelWidthOption(value)}
                placeholder="Full Width"
                panelWidth="w-full" // Set to w-full Tailwind class
              />
            </div>

            {/* Specific Width */}
            <div className="w-64">
              <Dropdown
                options={cityOptions}
                value={selectedPanelWidthOption}
                onChange={(value) => setSelectedPanelWidthOption(value)}
                placeholder="Specific Width"
                panelWidth="w-48" // Set to a specific Tailwind width class
              />
            </div>
          </div>
        </div>


        {/* Dropdown with Option Template */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Option Template</h3>
          <div className="w-64">
            <Dropdown
              options={themedOptions} // Use options with icon data
              value={selectedTemplateOption}
              onChange={(value) => setSelectedTemplateOption(value)}
              placeholder="Select with Template"
              optionLabel="label" // Specify the label key if options are objects
              optionValue="value" // Specify the value key if options are objects
              optionTemplate={CustomOptionTemplate} // Pass the template function
            />
          </div>
        </div>


      </section>

      {/* Checkbox Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Checkbox</h2>

        {/* Basic Checkbox */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Basic Checkbox</h3>
          <Checkbox
            checked={basicChecked}
            onChange={setBasicChecked}
            label="Check me"
          />
        </div>

        {/* Checkboxes with Severities */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Severities (Checked)</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Checkbox checked={primaryChecked} onChange={setPrimaryChecked} severity="primary" label="Primary" />
            <Checkbox checked={secondaryChecked} onChange={setSecondaryChecked} severity="secondary" label="Secondary" />
            <Checkbox checked={successChecked} onChange={setSuccessChecked} severity="success" label="Success" />
            <Checkbox checked={infoChecked} onChange={setInfoChecked} severity="info" label="Info" />
            <Checkbox checked={warningChecked} onChange={setWarningChecked} severity="warning" label="Warning" />
            <Checkbox checked={dangerChecked} onChange={setDangerChecked} severity="danger" label="Danger" />
            <Checkbox checked={helpChecked} onChange={setHelpChecked} severity="help" label="Help" />
          </div>
        </div>

        {/* Checkboxes with Label Positioning */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Label Positioning</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Checkbox checked={basicChecked} onChange={setBasicChecked} label="Label on Right" labelPosition="right" />
            <Checkbox checked={labelLeftChecked} onChange={setLabelLeftChecked} label="Label on Left" labelPosition="left" />
          </div>
        </div>

        {/* Checkbox with Error */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Error</h3>
          <div className="w-64">
            <Checkbox checked={errorChecked} onChange={setErrorChecked} label="Agree to terms" error="You must agree to the terms" />
          </div>
        </div>

        {/* Disabled Checkbox */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Disabled</h3>
          <Checkbox checked={true} onChange={() => { }} label="Disabled Checked" disabled />
          <Checkbox checked={false} onChange={() => { }} label="Disabled Unchecked" disabled className="ml-4" />
        </div>


      </section>

      {/* Radio Button Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Radio Button</h2>

        {/* Radio Button Group Example */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Radio Group</h3>
          <div className="flex flex-wrap items-center gap-4">
            <RadioButton
              name="fruit" // Same name groups them
              value="apple"
              label="Apple"
              checked={selectedFruit === 'apple'} // Checked if value matches state
              onChange={(checked) => checked && setSelectedFruit('apple')} // Update state when this radio is checked
            />
            <RadioButton
              name="fruit"
              value="banana"
              label="Banana"
              checked={selectedFruit === 'banana'}
              onChange={(checked) => checked && setSelectedFruit('banana')}
            />
            <RadioButton
              name="fruit"
              value="orange"
              label="Orange"
              checked={selectedFruit === 'orange'}
              onChange={(checked) => checked && setSelectedFruit('orange')}
            />
          </div>
          <p className="mt-2 text-sm text-foreground">Selected Fruit: {selectedFruit}</p>
        </div>

        {/* Radio Buttons with Severities (Selected) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Severities (Selected)</h3>
          <div className="flex flex-wrap items-center gap-4">
            <RadioButton
              name="severity-radio"
              value="primary"
              label="Primary"
              severity="primary"
              checked={selectedSeverity === 'primary'}
              onChange={(checked) => checked && setSelectedSeverity('primary')}
            />
            <RadioButton
              name="severity-radio"
              value="secondary"
              label="Secondary"
              severity="secondary"
              checked={selectedSeverity === 'secondary'}
              onChange={(checked) => checked && setSelectedSeverity('secondary')}
            />
            <RadioButton
              name="severity-radio"
              value="success"
              label="Success"
              severity="success"
              checked={selectedSeverity === 'success'}
              onChange={(checked) => checked && setSelectedSeverity('success')}
            />
            <RadioButton
              name="severity-radio"
              value="info"
              label="Info"
              severity="info"
              checked={selectedSeverity === 'info'}
              onChange={(checked) => checked && setSelectedSeverity('info')}
            />
            <RadioButton
              name="severity-radio"
              value="warning"
              label="Warning"
              severity="warning"
              checked={selectedSeverity === 'warning'}
              onChange={(checked) => checked && setSelectedSeverity('warning')}
            />
            <RadioButton
              name="severity-radio"
              value="danger"
              label="Danger"
              severity="danger"
              checked={selectedSeverity === 'danger'}
              onChange={(checked) => checked && setSelectedSeverity('danger')}
            />
            <RadioButton
              name="severity-radio"
              value="help"
              label="Help"
              severity="help"
              checked={selectedSeverity === 'help'}
              onChange={(checked) => checked && setSelectedSeverity('help')}
            />
          </div>
        </div>

        {/* Radio Buttons with Label Positioning */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Label Positioning</h3>
          <div className="flex flex-wrap items-center gap-4">
            <RadioButton
              name="label-pos-radio"
              value="right-label"
              label="Label on Right"
              labelPosition="right"
              checked={true} // Example of a checked radio
              onChange={() => { }} // No state change needed for this example
            />
            <RadioButton
              name="label-pos-radio"
              value="left-label"
              label="Label on Left"
              labelPosition="left"
              checked={false} // Example of an unchecked radio
              onChange={() => { }}
            />
          </div>
        </div>

        {/* Disabled Radio Buttons */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Disabled</h3>
          <div className="flex flex-wrap items-center gap-4">
            <RadioButton
              name="disabled-radio"
              value="disabled-checked"
              label="Disabled Checked"
              checked={true}
              onChange={() => { }}
              disabled
            />
            <RadioButton
              name="disabled-radio"
              value="disabled-unchecked"
              label="Disabled Unchecked"
              checked={false}
              onChange={() => { }}
              disabled
            />
          </div>
        </div>


      </section>

      {/* Toggle Switch Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Toggle Switch</h2>

        {/* Basic Toggle Switch */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Basic Toggle Switch</h3>
          <ToggleSwitch checked={basicToggleChecked} onChange={setBasicToggleChecked} label="Toggle me" />
        </div>

        {/* Toggle Switches with Severities */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Severities (Checked)</h3>
          <div className="flex flex-wrap items-center gap-4">
            <ToggleSwitch checked={primaryToggleChecked} onChange={setPrimaryToggleChecked} severity="primary" label="Primary" />
            <ToggleSwitch checked={secondaryToggleChecked} onChange={setSecondaryToggleChecked} severity="secondary" label="Secondary" />
            <ToggleSwitch checked={successToggleChecked} onChange={setSuccessToggleChecked} severity="success" label="Success" />
            <ToggleSwitch checked={infoToggleChecked} onChange={setInfoToggleChecked} severity="info" label="Info" />
            <ToggleSwitch checked={warningToggleChecked} onChange={setWarningToggleChecked} severity="warning" label="Warning" />
            <ToggleSwitch checked={dangerToggleChecked} onChange={setDangerToggleChecked} severity="danger" label="Danger" />
            <ToggleSwitch checked={helpToggleChecked} onChange={setHelpToggleChecked} severity="help" label="Help" />
          </div>
        </div>

        {/* Toggle Switches with Label Positioning */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Label Positioning</h3>
          <div className="flex flex-wrap items-center gap-4">
            <ToggleSwitch checked={basicToggleChecked} onChange={setBasicToggleChecked} label="Label on Right" labelPosition="right" />
            <ToggleSwitch checked={labelLeftToggleChecked} onChange={setLabelLeftToggleChecked} label="Label on Left" labelPosition="left" />
          </div>
        </div>

        {/* Disabled Toggle Switches */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Disabled</h3>
          <div className="flex flex-wrap items-center gap-4">
            <ToggleSwitch checked={disabledToggleChecked} onChange={() => { }} label="Disabled Checked" disabled />
            <ToggleSwitch checked={disabledUncheckedToggleChecked} onChange={() => { }} label="Disabled Unchecked" disabled className="ml-4" /> {/* Added ml-4 for spacing */}
          </div>
        </div>


      </section>

      {/* Card Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Card</h2>

        {/* Basic Card (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Basic Card</h3>
          <div className="w-96">
            <Card>
              <p className="text-foreground">This is a basic card with some content inside. It has a default shadow and padding.</p>
            </Card>
          </div>
        </div>

        {/* Card with Different Padding (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Padding Options</h3>
          <div className="flex flex-wrap items-start gap-6">
            <div className="w-64">
              <Card padding="sm">
                <p className="text-foreground">Small Padding</p>
              </Card>
            </div>
            <div className="w-64">
              <Card padding="md">
                <p className="text-foreground">Medium Padding (Default)</p>
              </Card>
            </div>
            <div className="w-64">
              <Card padding="lg">
                <p className="text-foreground">Large Padding</p>
              </Card>
            </div>
            <div className="w-64">
              <Card padding="none">
                <p className="text-foreground">No Padding</p>
              </Card>
            </div>
          </div>
        </div>


        {/* Card with Title (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Card with Title</h3>
          <div className="w-96">
            <Card title="Card Title">
              <p className="text-foreground">This card has a dedicated title section.</p>
            </Card>
          </div>
        </div>

        {/* Card with Footer (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Card with Footer</h3>
          <div className="w-96">
            <Card footer={<span className="text-sm text-gray-500">Card Footer Content</span>}>
              <p className="text-foreground">This card has a dedicated footer section.</p>
            </Card>
          </div>
        </div>

        {/* Card with Title and Footer (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Card with Title and Footer</h3>
          <div className="w-96">
            <Card
              title={<span className="text-primary font-semibold">Themed Title</span>}
              footer={<Button size="sm">Action</Button>}
            >
              <p className="text-foreground">This card has both a title and a footer.</p>
            </Card>
          </div>
        </div>


        {/* Card with Border and without Shadow (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Border, Without Shadow</h3>
          <div className="w-96">
            <Card hasBorder hasShadow={false}>
              <p className="text-foreground">This card has a border but no shadow.</p>
            </Card>
          </div>
        </div>

        {/* Card without Border and Shadow (Keep existing) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Without Border and Shadow</h3>
          <div className="w-96">
            <Card hasBorder={false} hasShadow={false} className="bg-transparent"> {/* You might need a background class here */}
              <p className="text-foreground">This card has no border and no shadow. Often used for transparent containers.</p>
            </Card>
          </div>
        </div>

        {/* Card with Image Header, Title, and Footer */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Image Header, Title, and Footer</h3>
          <div className="w-96"> {/* Adjust width as needed */}
            <Card
              header={cardImageHeader} // Use the image header element
              title="Advanced Card" // You can still use a string title
              footer={cardFooterWithButtons} // Use the footer with buttons element
            >
              <p className="text-foreground">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
                numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
              </p>
            </Card>
          </div>
        </div>


      </section>

      {/* Typography Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Typography</h2>

        {/* Heading Levels */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Heading Levels</h3>
          <Heading level={1}>Heading 1</Heading>
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Heading level={4}>Heading 4</Heading>
          <Heading level={5}>Heading 5</Heading>
          <Heading level={6}>Heading 6</Heading>
        </div>

        {/* Headings with Colors */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Heading Colors</h3>
          <Heading level={2} color="primary">Primary Heading</Heading>
          <Heading level={3} color="secondary">Secondary Heading</Heading>
          <Heading level={4} color="success">Success Heading</Heading>
          <Heading level={5} color="danger">Danger Heading</Heading>
          <Heading level={6} color="warning">Warning Heading</Heading>
        </div>

        {/* Headings with Weights (Default weights are in Typography.module.css) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Heading Weights</h3>
          <Heading level={2} weight="light">Light Heading</Heading>
          <Heading level={2} weight="normal">Normal Heading</Heading>
          <Heading level={2} weight="medium">Medium Heading</Heading>
          <Heading level={2} weight="semibold">Semibold Heading</Heading>
          <Heading level={2} weight="bold">Bold Heading</Heading>
        </div>


        {/* Paragraphs */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Paragraphs</h3>
          <Paragraph>
            This is a default paragraph. It has standard size and foreground color.
          </Paragraph>
          <Paragraph size="sm">
            This is a small paragraph.
          </Paragraph>
          <Paragraph size="lg">
            This is a large paragraph.
          </Paragraph>
        </div>

        {/* Paragraphs with Colors */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Paragraph Colors</h3>
          <Paragraph color="primary">This is a primary colored paragraph.</Paragraph>
          <Paragraph color="secondary">This is a secondary colored paragraph.</Paragraph>
          <Paragraph color="success">This is a success colored paragraph.</Paragraph>
        </div>

        {/* Paragraphs with Weights */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Paragraph Weights</h3>
          <Paragraph weight="light">This is a light weight paragraph.</Paragraph>
          <Paragraph weight="normal">This is a normal weight paragraph.</Paragraph>
          <Paragraph weight="bold">This is a bold weight paragraph.</Paragraph>
        </div>

      </section>

      {/* Badge Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Badge</h2>

        {/* Filled Badges with Severities */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Filled Severities</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Badge severity="primary">Primary</Badge>
            <Badge severity="secondary">Secondary</Badge>
            <Badge severity="success">Success</Badge>
            <Badge severity="info">Info</Badge>
            <Badge severity="warning">Warning</Badge>
            <Badge severity="danger">Danger</Badge>
            <Badge severity="help">Help</Badge>
          </div>
        </div>

        {/* Outlined Badges with Severities */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Outlined Severities</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="outlined" severity="primary">Primary</Badge>
            <Badge variant="outlined" severity="secondary">Secondary</Badge>
            <Badge variant="outlined" severity="success">Success</Badge>
            <Badge variant="outlined" severity="info">Info</Badge>
            <Badge variant="outlined" severity="warning">Warning</Badge>
            <Badge variant="outlined" severity="danger">Danger</Badge>
            <Badge variant="outlined" severity="help">Help</Badge>
          </div>
        </div>

        {/* Text Badges with Severities */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Text Severities</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="text" severity="primary">Primary</Badge>
            <Badge variant="text" severity="secondary">Secondary</Badge>
            <Badge variant="text" severity="success">Success</Badge>
            <Badge variant="text" severity="info">Info</Badge>
            <Badge variant="text" severity="warning">Warning</Badge>
            <Badge variant="text" severity="danger">Danger</Badge>
            <Badge variant="text" severity="help">Help</Badge>
          </div>
        </div>


        {/* Rounded Badges */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Rounded</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Badge isRounded severity="primary">Rounded</Badge>
            <Badge isRounded variant="outlined" severity="secondary">Rounded Outlined</Badge>
          </div>
        </div>

        {/* Badges with Icons */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Icons</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Badge icon={<FaStar />} severity="warning">Featured</Badge>
            <Badge icon={<FaTag />} iconPosition="right" severity="info">New</Badge>
            <Badge icon={<FaCheck />} severity="success"></Badge> {/* Icon only badge */}
          </div>
        </div>

      </section>

      {/* File Upload Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">File Upload</h2>

        {/* Basic File Upload (Single) */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Basic File Upload (Single)</h3>
          <div className="w-96"> {/* Container for controlling width */}
            <FileUpload onSelect={setBasicUploadFiles} />
            <p className="mt-2 text-sm text-foreground">Selected Files: {basicUploadFiles.map(file => file.name).join(', ')}</p>
          </div>
        </div>

        {/* File Upload with Multiple Files */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Multiple Files</h3>
          <div className="w-96">
            <FileUpload multiple onSelect={setMultipleUploadFiles} />
            <p className="mt-2 text-sm text-foreground">Selected Files: {multipleUploadFiles.map(file => file.name).join(', ')}</p>
          </div>
        </div>

        {/* File Upload with Accept */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Accept (.jpg, .png)</h3>
          <div className="w-96">
            <FileUpload accept=".jpg,.png" onSelect={setImageUploadFiles} />
            <p className="mt-2 text-sm text-foreground">Selected Files: {imageUploadFiles.map(file => file.name).join(', ')}</p>
          </div>
        </div>

        {/* File Upload with Custom Label */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Custom Label</h3>
          <div className="w-96">
            <FileUpload
              onSelect={setCustomLabelUploadFiles}
              uploadButtonLabel={
                <div className="flex flex-col items-center">
                  {/* Replace with your upload icon */}
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  <span className="mt-2 text-sm font-medium text-primary-600">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                </div>
              }
            />
            <p className="mt-2 text-sm text-foreground">Selected Files: {customLabelUploadFiles.map(file => file.name).join(', ')}</p>
          </div>
        </div>

        {/* File Upload without File List */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Without File List</h3>
          <div className="w-96">
            <FileUpload onSelect={setNoFileListUploadFiles} showFileList={false} />
            <p className="mt-2 text-sm text-foreground">Selected Files (handled in state but not displayed by component): {noFileListUploadFiles.map(file => file.name).join(', ')}</p>
          </div>
        </div>


        {/* Disabled File Upload */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Disabled</h3>
          <div className="w-96">
            <FileUpload onSelect={() => { }} disabled />
          </div>
        </div>

        {/* File Upload with Max Size */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Maximum Size (e.g., 1MB)</h3>
          <div className="w-96">
            {/* Set maxSize to 1MB (1024 * 1024 bytes) */}
            <FileUpload onSelect={setMaxSizeUploadFiles} maxSize={1024 * 1024} multiple /> {/* Added multiple to test selecting multiple files */}
            <p className="mt-2 text-sm text-foreground">Valid Selected Files (exceeding size will show error in list): {maxSizeUploadFiles.map(file => file.name).join(', ')}</p>
          </div>
        </div>


      </section>


      {/* DatePicker Component Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">DatePicker</h2>

        {/* Basic Single DatePicker */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Basic Single Date</h3>
          <div className="w-64"> {/* Container to control width */}
            <DatePicker
              value={selectedSingleDate}
              onSelect={setSelectedSingleDate}
              placeholder="Select Date"
            />
          </div>
          <p className="mt-2 text-sm text-foreground">Selected: {selectedSingleDate ? selectedSingleDate.toDateString() : 'None'}</p>
        </div>

        {/* Date Range Picker */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Date Range</h3>
          <div className="w-64">
            <DatePicker
              value={selectedRange}
              onSelect={setSelectedRange}
              placeholder="Select Date Range"
              isRange
            />
          </div>
          <p className="mt-2 text-sm text-foreground">Selected: {selectedRange?.from?.toDateString() || 'None'} - {selectedRange?.to?.toDateString() || 'None'}</p>
        </div>

        {/* Month and Year Only Picker */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Month and Year Only</h3>
          <div className="w-64">
            <DatePicker
              value={selectedMonthYear}
              onSelect={setSelectedMonthYear}
              placeholder="Select Month/Year"
              monthOnly
              format="MM/yyyy" // Example format for month/year
            />
          </div>
          <p className="mt-2 text-sm text-foreground">Selected: {selectedMonthYear ? selectedMonthYear.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'None'}</p>
        </div>

        {/* Year Only Picker */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Year Only</h3>
          <div className="w-64">
            <DatePicker
              value={selectedYearOnly}
              onSelect={setSelectedYearOnly}
              placeholder="Select Year"
              yearOnly
              format="yyyy" // Example format for year
              // You might need to set a min/max date for a reasonable year range
              minDate={new Date(2000, 0, 1)}
              maxDate={new Date(2030, 11, 31)}
            />
          </div>
          <p className="mt-2 text-sm text-foreground">Selected: {selectedYearOnly ? selectedYearOnly.getFullYear() : 'None'}</p>
        </div>


        {/* DatePicker with Min/Max Dates */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Min/Max Dates</h3>
          <div className="w-64">
            <DatePicker
              value={minMaxDate}
              onSelect={setMinMaxDate}
              placeholder="Select within Range"
              minDate={new Date(new Date().setDate(new Date().getDate() - 7))} // Min date is 7 days ago
              maxDate={new Date(new Date().setDate(new Date().getDate() + 7))} // Max date is 7 days from now
            />
          </div>
          <p className="mt-2 text-sm text-foreground">Selected: {minMaxDate ? minMaxDate.toDateString() : 'None'}</p>
        </div>


        {/* Inline DatePicker */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Inline Calendar</h3>
          <div className="w-fit"> {/* Container to fit calendar width */}
            <DatePicker
              value={inlineDate}
              onSelect={setInlineDate}
              inline // Render inline
            />
          </div>
          <p className="mt-2 text-sm text-foreground">Selected: {inlineDate ? inlineDate.toDateString() : 'None'}</p>
        </div>


        {/* DatePicker with Icon */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Icon</h3>
          <div className="flex flex-wrap items-center gap-4">
            {/* Left Icon */}
            <div className="w-64">
              <DatePicker
                value={selectedSingleDate} // Reuse state for demo
                onSelect={setSelectedSingleDate}
                placeholder="Select Date with Icon"
                icon={<FaCalendarAlt />} // Use the calendar icon
                iconPosition="left"
              />
            </div>
            {/* Right Icon */}
            <div className="w-64">
              <DatePicker
                value={selectedSingleDate} // Reuse state for demo
                onSelect={setSelectedSingleDate}
                placeholder="Select Date with Icon"
                icon={<FaCalendarAlt />}
                iconPosition="right"
              />
            </div>
          </div>
        </div>

        {/* DatePicker with Footer */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Footer</h3>
          <div className="w-64">
            <DatePicker
              value={selectedSingleDate} // Reuse state for demo
              onSelect={setSelectedSingleDate}
              placeholder="Select Date with Footer"
              showFooter // Show the footer
            />
          </div>
          <p className="mt-2 text-sm text-foreground">Selected: {selectedSingleDate ? selectedSingleDate.toDateString() : 'None'}</p>
        </div>

        {/* DatePicker with Error */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">With Error</h3>
          <div className="w-64">
            <DatePicker
              value={dateWithError}
              onSelect={setDateWithError}
              placeholder="Select Date"
              error="This field is required" // Show error message
            />
          </div>
        </div>

        {/* Disabled DatePicker */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-foreground">Disabled</h3>
          <div className="w-64">
            <DatePicker
              value={new Date()} // Example: set a default value
              onSelect={() => { }} // No state change
              placeholder="Disabled Date Picker"
              disabled // Disable the picker
            />
          </div>
        </div>

      </section>





      {/* Add sections for other components here as you build them */}

    </div>
  );
};

export default ComponentsDocsPage;
