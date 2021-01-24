/**
 * updates time totals
 */

export const addTime = (total, addend) => {
  const updatedTime = {
    hours: total.hours + addend.hours,
    minutes: total.minutes + addend.minutes,
  };

  if (updatedTime.minutes >= 60) {
    const remainder = updatedTime.minutes % 60;
    const hours = (updatedTime.minutes - remainder) / 60;

    updatedTime.hours = updatedTime.hours + hours;
    updatedTime.minutes = remainder;
  }

  return {...updatedTime};
};

export const removeTime = (total, subtrahend) => {
  let { hours, minutes } = total;

  if (subtrahend.minutes > minutes) {
		hours = hours - 1;
		minutes = minutes + 60;
  }

  const updatedTime = {
    hours: hours - subtrahend.hours,
    minutes: minutes - subtrahend.minutes,
  };

  return {...updatedTime};
};

/**
 * generates difference in hours and minutes between two times
 */
export const generateTime = (start, stop) => {
	const startCol = start.indexOf(":");
	const startTime = {
	  hours: parseInt(start.substring(0, startCol)),
	  minutes: parseInt(start.substring(startCol + 1))
	};
  
	const stopCol = stop.indexOf(":");
	const stopTime = {
	  hours: parseInt(stop.substring(0, stopCol)),
	  minutes: parseInt(stop.substring(stopCol + 1))
	};

	// If stop time is before start time, return
	if (startTime.hours > stopTime.hours) return false;
  
	if (stopTime.minutes < startTime.minutes) {
	  stopTime.hours = stopTime.hours - 1;
	  stopTime.minutes = stopTime.minutes + 60;
	}
  
	return { hours: stopTime.hours - startTime.hours, minutes: stopTime.minutes - startTime.minutes };
};

/**
 * formats time with AM/PM and converts to 12 hour day (vs 24)
 */
export const formatTime = (time) => {
	let hour = parseInt(time.substring(0, 2));
	let min = time.substring(3);
  
	let period = "AM";
  
	if (hour >= 12) {
	  period = "PM"
  
	  if (hour > 12) {
		hour = hour - 12;
	  }
	}
	
	return `${hour}:${min}${period}`;
  
};
