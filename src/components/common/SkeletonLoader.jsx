import React from 'react';
import { Skeleton } from 'antd';
import SectionCard from './SectionCard';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'stat':
        return (
          <SectionCard className={className}>
            <Skeleton active title={false} paragraph={{ rows: 2, width: ['40%', '80%'] }} />
          </SectionCard>
        );
      case 'list':
        return (
          <SectionCard className={className}>
            <Skeleton active avatar paragraph={{ rows: 1, width: '60%' }} />
            <Skeleton active avatar paragraph={{ rows: 1, width: '70%' }} className="mt-4" />
            <Skeleton active avatar paragraph={{ rows: 1, width: '50%' }} className="mt-4" />
          </SectionCard>
        );
      case 'chart':
        return (
          <SectionCard className={className}>
            <Skeleton.Node active style={{ width: '100%', height: '300px' }} />
          </SectionCard>
        );
      case 'card':
      default:
        return (
          <SectionCard className={className}>
            <Skeleton active />
          </SectionCard>
        );
    }
  };

  if (count === 1) return renderSkeleton();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
      ))}
    </div>
  );
};

export default SkeletonLoader;
