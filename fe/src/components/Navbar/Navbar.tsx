import { Group, Text, ScrollArea } from "@mantine/core";
import { IconGauge, IconSearch } from "@tabler/icons-react";
import LinksGroup from "./NavbarLinksGroup";
import classes from "./Navbar.module.scss";
import clsx from "clsx";

const mockdata = [
  { label: "Dashboard", Icon: IconGauge, link: "/" },
  { label: "Search Scores", Icon: IconSearch, link: "/search-scores" },
];

const Navbar = () => {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav
      className={clsx(
        classes.navbar,
        "transition-all duration-300",
        "w-[250px]"
      )}
    >
      <div className={classes.header}>
        <Group>
          <Text
            size="xl"
            fw={900}
            className={clsx(classes.logoText, classes.expanded)}
          >
            Menu
          </Text>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={`${classes.linksInner} overflow-x-hidden`}>{links}</div>
      </ScrollArea>
    </nav>
  );
};

export default Navbar;
