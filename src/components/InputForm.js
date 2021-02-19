import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { rem } from 'polished';
import generateID from '../util/generateID';
import { generateTime } from '../util/time';

const StyledForm = styled.form`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 120px repeat(2, 115px) 2fr 3fr 46px;
  grid-gap: 20px;
  max-width: 65vw;
`;

const StyledLabel = styled.label`
  color: ${props => props.theme.pink};
  font-size: ${rem(12)};
  font-weight: 700;
  display: block;
`;

const inputStyles = css`
  background: ${props => props.theme.white};
  width: 100%;
  height: 35px;
  padding: 0 10px;
  border: 1px solid ${props => props.theme.melon};
  font-family: ${props => props.theme.sansSerif};

  &:focus {
    outline: 1px dashed ${props => props.theme.teal};
    outline-offset: -1px;
  }
`;

const StyledInput = styled.input`
  ${inputStyles};
`;

const StyledSelect = styled.select`
  ${inputStyles};
`;

const StyledSubmit = styled.input`
  align-self: flex-end;
  height: 35px;
  padding: 0 10px;
  background: ${props => props.theme.pink};
  color: ${props => props.theme.white};
  border: 0;
  font-weight: 700;
`;

const StyledError = styled.span`
  display: block;
  position: absolute;
  left: 0;
  bottom: -20px;
  font-size: ${rem(12)};
`;


const InputForm = ({ today, addItem }) => {
  const initialState = {
    weekday: today,
    start: '',
    stop: '',
    project: '',
    description: '',
  };

  const [formValues, setFormValues] = useState({...initialState});
  const [formErrors, setFormErrors] = useState(null);
  const weekday = useRef();

  const updateField = e => {
    setFormValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const errorCheck = () => {
	  if (!formValues.start || formValues.start === "") {
		setFormErrors('Please enter in a start time');
	  } else if (!formValues.stop || formValues.stop === "") {
		setFormErrors('Please enter in a stop time');
	  } else if (generateTime(formValues.start, formValues.stop) <= 0) {
		setFormErrors('Please enter in a stop time later than the start time');
	  } else if (!formValues.project) {
		setFormErrors('Please enter in a project name');
	  } else {
			setFormErrors(null);
		}
  }
 
  const handleSubmit = (e) => {
	e.preventDefault();
	
	errorCheck();

	if (formErrors !== null) return;

    addItem({
      day: formValues.weekday,
      info: {
        id: generateID(),
        time: generateTime(formValues.start, formValues.stop),
        start: formValues.start,
        stop: formValues.stop,
        project: formValues.project,
        description: formValues.description,
      }
    });
    e.target.reset();
    setFormValues({...initialState});
	weekday.current.focus();
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return (
    <StyledForm onSubmit={handleSubmit}>
      <div>
        <StyledLabel htmlFor="weekday">Day</StyledLabel>
        <StyledSelect
          name="weekday"
          id="weekday"
          value={formValues['weekday']}
          onChange={updateField}
		  ref={weekday}
        >
          {days.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
          
        </StyledSelect>
      </div>

      <div>
        <StyledLabel htmlFor="start">Start Time</StyledLabel>
        <StyledInput
          type="time"
          name="start"
          id="start"
          value={formValues['start']}
          onChange={updateField}
        />
      </div>

      <div>
        <StyledLabel htmlFor="stop">Stop Time</StyledLabel>
        <StyledInput
          type="time"
          name="stop"
          id="stop"
          value={formValues['stop']}
          onChange={updateField}
        />
      </div>

      <div>
        <StyledLabel htmlFor="project">Project</StyledLabel>
        <StyledInput
          type="text"
          name="project"
          id="project"
          value={formValues['project']}
          onChange={updateField}
        />
      </div>

      <div>
        <StyledLabel htmlFor="description">Description</StyledLabel>
        <StyledInput
          type="text"
          name="description"
          id="description"
          value={formValues['description']}
          onChange={updateField}
        />
      </div>
      <StyledSubmit type="submit" value="Add" />
	  
	  {/* {formErrors &&
	  	<StyledError>{formErrors}</StyledError>
	  } */}
    </StyledForm>
  );
};

InputForm.propTypes = {
	today: PropTypes.string,
	addItem: PropTypes.func,
};

export default InputForm;
