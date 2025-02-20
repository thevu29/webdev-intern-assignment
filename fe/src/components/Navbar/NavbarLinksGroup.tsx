import { useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./NavbarLinksGroup.module.scss";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { TablerIcon } from "@tabler/icons-react";

interface LinksGroupProps {
  Icon: TablerIcon;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { link: string; label: string }[];
}

const LinksGroup: React.FC<LinksGroupProps> = ({
  Icon,
  label,
  initiallyOpened,
  link,
  links,
}) => {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const location = useLocation();
  const pathname = location.pathname;

  const isChildActive =
    hasLinks && links.some((childLink) => pathname.startsWith(childLink.link));

  const isDirectLinkActive =
    link && (link === "/" ? pathname === link : pathname.startsWith(link));

  const isActive = isDirectLinkActive || isChildActive;

  const items = (hasLinks ? links : []).map((link) => (
    <Link className={classes.link} to={link.link} key={link.label}>
      {link.label}
    </Link>
  ));

  if (link) {
    return (
      <Link
        className={clsx(classes.control, {
          [classes.active]: isActive,
        })}
        to={link}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md" className={clsx(classes.label, classes.expanded)}>
              {label}
            </Box>
          </Box>
        </Group>
      </Link>
    );
  }

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={clsx(classes.control, {
          [classes.active]: isActive,
        })}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md" className={clsx(classes.label, classes.expanded)}>
              {label}
            </Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={clsx(classes.chevron, classes.expanded)}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? "rotate(-90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
};

export default LinksGroup;
