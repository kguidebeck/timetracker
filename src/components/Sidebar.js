import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
// import PropTypes from 'prop-types';

const StyledSidebar = styled.aside`
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0px;
  width: 465px;
  padding-bottom: 75px;
  background: ${props => props.theme.white};
`;

const SidebarContainer = styled.div`
  padding: 45px;
  overflow-y: scroll;
`;

const SidebarHeader = styled.h2``;

const TimeTotals = styled.ul`
  list-style: none;
  padding: 0;
`;

const TimeDay = styled.li`
  &:not(:last-of-type) {
    margin-bottom: 25px;
  }
`;

const DayHeading = styled.h3`
  margin-bottom: 10px;
`;

const TimeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TimeItem = styled.li`
  display: flex;
  justify-content: space-between;

  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
`;

const ItemProject = styled.span`
  font-size: ${rem(14)};
`;

const ItemTime = styled.span`
  color: ${props => props.theme.teal};
  font-weight: 700;
`;

const EmptyItem = styled.span`
  display: block;
  margin: 15px 0;
  padding: 0 15px;
`;

const Sidebar = ({ items }) => (
  <StyledSidebar>
    <SidebarContainer>
      <SidebarHeader>Time Totals</SidebarHeader>
      <TimeTotals>
        {items.map(day => (
          <TimeDay key={day.name}>
            <DayHeading>{day.name}{day.timeTotal && <span> | {day.timeTotal.hours}H {day.timeTotal.minutes}M</span>}</DayHeading>
            {day.items.length > 0 &&
              <TimeList>
                {day.projects.map(proj => (
                  <TimeItem key={proj.name}>
                    <ItemProject>{proj.name}</ItemProject>
                    <ItemTime>{proj.time.hours}H {proj.time.minutes}M</ItemTime>
                  </TimeItem>
                ))}
              </TimeList>
            }
            {day.items.length === 0 &&
              <EmptyItem>Currently no time added.</EmptyItem>
            }
          </TimeDay>
        ))}
      </TimeTotals>
    </SidebarContainer>
  </StyledSidebar>
);

Sidebar.propTypes = {

};

export default Sidebar;
