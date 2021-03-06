import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, Avatar } from '@material-ui/core';
import Link from '@material-ui/core/Link';

import { useInfiniteScroll } from 'react-infinite-scroll-hook';

import FullWidthSpinner from '../component/FullWidthSpinner';
import Snackbar from '../component/Snackbar';
import { useFollowersList } from '../react-query/user';

const useStyles = makeStyles((theme) => ({
  gutter_2: {
    marginBottom: theme.spacing(2),
  },

  flex_i_center: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex_col_center: {
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
    flexDirection: 'column',
  },
}));

function Followers({ insideModal }) {
  const classes = useStyles();

  const { username } = useParams();

  const {
    status,
    canFetchMore,
    isFetchingMore,
    isFetching,
    fetchMore,
    data,
    error,
  } = useFollowersList(username);

  const infiniteRef = useInfiniteScroll({
    loading: isFetchingMore || isFetching,
    hasNextPage: !!canFetchMore || isFetchingMore,
    onLoadMore: () => {
      fetchMore();
    },
  });

  return status === 'loading' ? (
    <FullWidthSpinner />
  ) : (
    <div>
      {!insideModal && (
        <Typography
          style={{ marginBottom: '2rem' }}
          component="h1"
          variant="h4"
        >
          Followers
        </Typography>
      )}
      {!data[0]?.length && !isFetching && !canFetchMore && (
        <Typography component="p" variant="subtitle1">
          No followers found
        </Typography>
      )}
      <div ref={infiniteRef}>
        {data.map((followersGroup, i) => (
          <React.Fragment key={i}>
            {followersGroup.map((follower) => (
              <div className={classes.gutter_2} key={follower._id}>
                <Link
                  underline="none"
                  color="inherit"
                  component={RouterLink}
                  to={`/@${follower.username}`}
                  className={classes.flex_i_center}
                >
                  <Avatar
                    style={{ marginRight: '1rem' }}
                    alt={follower.name}
                    src={follower.profilePicUrl}
                  />
                  <div className={classes.flex_col_center}>
                    <Typography variant="h6">{follower.username}</Typography>
                    <Typography variant="body2">{follower.name}</Typography>
                  </div>
                </Link>
              </div>
            ))}
          </React.Fragment>
        ))}
        {(isFetchingMore || isFetching || !!canFetchMore) && (
          <FullWidthSpinner />
        )}
        {status === 'error' && (
          <Snackbar severity="error" message={error.message} />
        )}
      </div>
    </div>
  );
}

export default Followers;
