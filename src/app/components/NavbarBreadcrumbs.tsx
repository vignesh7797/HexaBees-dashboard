'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Link href="/">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ textDecoration: 'none', color: 'text.primary' }}>
          <HomeRoundedIcon sx={{ fontSize: '1.25rem' }} />
          <Typography variant="body1">
            Home
          </Typography>
        </Stack>
      </Link>
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1);

        return isLast ? (
          <Typography
            key={href}
            variant="body1"
            sx={{ color: 'text.primary', fontWeight: 600, }}
          >
            {name}
          </Typography>
        ) : (
          <Link key={href} href={href}>
            <Typography variant="body1" sx={{ textDecoration: 'none', color: 'inherit' }}>
              {name}
            </Typography>
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}
