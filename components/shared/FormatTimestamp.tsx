import React from 'react';
import moment from 'moment';

const FormatTimestamp = ({ timestamp }: { timestamp: number }) => {
  return (
    <div className="text-sm text-muted-foreground">
      {moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}
    </div>
  );
};

export default FormatTimestamp;