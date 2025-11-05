'use client';

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, link: '/' },
  { text: 'Menu', icon: <AnalyticsRoundedIcon />, link: '/menu' },
  { text: 'Clients', icon: <PeopleRoundedIcon />, link: '/clients' },
  { text: 'Tasks', icon: <AssignmentRoundedIcon />, link: '/tasks' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const pathname = usePathname();

  const selectedIndex = React.useMemo(() => {
    const matchingItems = mainListItems
      .map((item, index) => ({ ...item, index }))
      .filter((item) => pathname.startsWith(item.link));

    if (matchingItems.length === 0) {
      return 0; // Default to home
    }

    const bestMatch = matchingItems.reduce((a, b) =>
      a.link.length > b.link.length ? a : b
    );
    return bestMatch.index;
  }, [pathname]);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List>
        {mainListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ display: 'block', color: '#0b0e14', textDecoration: 'none' }}
            component={NextLink}
            href={item.link}
          >
            <ListItemButton selected={index === selectedIndex}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
