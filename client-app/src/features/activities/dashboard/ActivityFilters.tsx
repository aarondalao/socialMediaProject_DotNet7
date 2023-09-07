import { observer } from "mobx-react-lite";
import React from "react";
import Calendar from "react-calendar";
import { Menu, Header } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityFilters() {
  const { activityStore: {filterActions, setFilters} } = useStore();

  return (
    <>
      <Menu vertical size="large" style={{ width: "100%", marginTop: 28 }}>
        <Header icon="filter" attached color="teal" content="Filters" />
        <Menu.Item 
          active={filterActions.has('all')}
          onClick={() => setFilters('all', 'true')}
          content="All activities" />
        <Menu.Item 
          active={filterActions.has('isGoing')}
          onClick={() => setFilters('isGoing', 'true')}
          content="I'm going" />
        <Menu.Item 
          active={filterActions.has('isHost')}
          onClick={() => setFilters('isHost', 'true')}
          content="I'm hosting" />
      </Menu>
      <Header />
      <Calendar 
        onChange={(date) => setFilters('startDate', date as Date)}
        value={filterActions.get('startDate') || new Date()}
      />
    </>
  );
});
