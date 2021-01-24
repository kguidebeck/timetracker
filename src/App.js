import React, { useReducer, useEffect, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import { format, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import GlobalStyle from './styles/global-style';
import theme from './styles/theme';
import { addTime, removeTime } from './util/time';
import Header from './components/Header';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const setUpState = () => {
  const now = new Date();
  const days = eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) });
  days.shift();
  days.forEach((d, i) => {
    days[i] = {
      name: format(d, 'iiii'),
	  	timeTotal: null,
	  	projects: [],
      items: [],
    };
  });

  const initalState = {
    today: format(now, 'iiii') === 'Sunday' ? 'Saturday' : format(now, 'iiii'),
	timeTotal: null,
    days: [...days],
  }

  return initalState;
}

function reducer(state, action) {
  const { timeTotal, days } = state;
  const { type, item } = action;

  switch (type) {
    case 'setup': {
      const now = new Date();
      const today = format(now, 'iiii') === 'Sunday' ? 'Saturday' : format(now, 'iiii');
		  if (item.today !== today) {
        item.today = today;
      }
      return {...item};
		} case 'checkTotal': {
			let tempDays = days;
			let tempTotal = { hours: 0, minutes: 0 };

			tempDays.forEach(day => {
				let dayTotal = { hours: 0, minutes: 0 };

				day.items.forEach(item => {
					dayTotal = addTime(dayTotal, item.time);
				});

				// day.timeTotal = {...dayTotal};

				tempTotal = addTime(tempTotal, dayTotal);
			});

			console.log(...tempDays);

			return {
				...state,
				timeTotal: {...tempTotal},
				// days: {...tempDays}
			}
		} case 'add': {
      const tempDays = days;
      const day = tempDays.find(d => d.name === item.day);
      if (day) day.items = [...day.items, {...item.info}];

      // Add project/time to projectTotals based on day
      const project = day.projects.find(proj => proj.name === item.info.project);
      if (project) {
        project.time = addTime(project.time, item.info.time);
      } else {
        day.projects = [
          ...day.projects,
          {
            name: item.info.project,
            time: { ...item.info.time }
          }
        ];
      }

      // Update/add to day Total
      if (day.timeTotal) {
        day.timeTotal = addTime(day.timeTotal, item.info.time);
      } else {
        day.timeTotal = {...item.info.time};
      }

      // Update week total
      let tempTimeTotal = timeTotal;

      if (timeTotal) {
        tempTimeTotal = addTime(timeTotal, item.info.time);
      } else {
        tempTimeTotal = {...item.info.time};
      }
      
      return {
        ...state,
        timeTotal: {...tempTimeTotal},
        days: [...tempDays],
      };
    } case 'remove': {
      const tempDays = days;
      const day = tempDays.find(d => d.name === item.day);
      if (day) day.items = day.items.filter(i => i.id !== item.info.id);

      // Remove project/time to projectTotals based on day
      const project = day.projects.find(proj => proj.name === item.info.project);
      if (project) {
        const projectIndex = day.projects.findIndex(proj => proj.name === item.info.project);
        if (project.time.hours === item.info.time.hours && project.time.minutes === item.info.time.minutes) {
          day.projects.splice(projectIndex, 1);
        } else {
          project.time = removeTime(project.time, item.info.time);
        }
      }

      // Update to day Total
      day.timeTotal = removeTime(day.timeTotal, item.info.time);

      // Update week total
      let tempTimeTotal = timeTotal;
      tempTimeTotal = removeTime(timeTotal, item.info.time);
      
      return {
        ...state,
        timeTotal: {...tempTimeTotal},
        days: [...tempDays],
      };
    } case 'clearDay': {
			const tempDays = days;
			const day = tempDays.find(d => d.name === item);

			const dayTime = day.timeTotal;

			if (day) {
				// let { timeTotal, projects, items } = day;
				day.timeTotal = null;
	  		day.projects = [];
      	day.items = [];
			}

			return {
        ...state,
        // timeTotal: {...tempTimeTotal},
        days: [...tempDays],
      };
		} case 'clearAll': {
			const resetState = setUpState();
			console.log(resetState);
      return {...resetState};
		} default:
      throw new Error();
  }
}

const App = () => {
  const initialState = setUpState();;
  const [state, dispatch] = useReducer(reducer, initialState);

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (state) localStorage.setItem('TimeData', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const localItems = JSON.parse(localStorage.getItem('TimeData'));

		if (localItems) {
			dispatch({ type: 'setup', item: localItems });
			dispatch({ type: 'checkTotal' });
		}

  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Header
        today={state.today}
        addItem={(item) => { dispatch({ type: 'add', item }); }}
        clearAll={() => { dispatch({ type: 'clearAll' }); }}
      />
      <Main
        today={state.today}
        items={state.days}
        removeItem={(item) => { dispatch({ type: 'remove', item }); }}
				clearDay={(item) => { dispatch({ type: 'clearDay', item }); }}
      />
      <Sidebar items={state.days} />
      <Footer
        weekTotal={state.timeTotal || { hours: 0, minutes: 0 }}
        day={state.today}
        dayTotal={state.days.find(d => d.name === state.today).timeTotal || { hours: 0, minutes: 0 }}
      />
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default App;
