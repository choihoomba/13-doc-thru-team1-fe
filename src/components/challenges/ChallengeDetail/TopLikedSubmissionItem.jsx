import { useState } from 'react';

import Image from 'next/image';

import IcDownBracket from '@/app/assets/icons/icon_circle_down_angle_bracket_black.svg';
import IcMedal from '@/app/assets/icons/icon_medal.svg';
import ImgUser from '@/app/assets/images/img_user.svg';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useExpandableHeight } from '@/hooks/common/useExpandableHeight';
import { useModal } from '@/hooks/modal/useModal';
import { useToggleLike } from '@/hooks/queries/submissions/mutations';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ButtonLike from '@/components/ui/Button/ButtonLike';
import ModalNotice from '@/components/ui/Modal/ModalNotice';

const TOP_LIKED_SUBMISSION_HEIGHT = {
  mobile: 250,
  tablet: 244,
  desktop: 244,
};

export default function TopLikedSubmissionItem({ submission }) {
  const [likeStatus, setLikeStatus] = useState(
    submission.isLiked ? 'active' : 'inactive',
  );
  const { contentRef, open, height, toggleOpen } =
    useExpandableHeight(submission);
  const collapsedHeight = useBreakpointValue(TOP_LIKED_SUBMISSION_HEIGHT);
  const { mutate: toggleLike } = useToggleLike(submission.id);
  const { openModal, closeModal } = useModal();

  const handleToggleLike = () => {
    toggleLike(likeStatus === 'active', {
      onSuccess: ({ liked }) => {
        setLikeStatus(liked ? 'active' : 'inactive');
      },
      onError: (error) => {
        openModal(
          <ModalNotice message={error.message} onConfirm={closeModal} />,
        );
      },
    });
  };

  return (
    <article
      className={cn(
        'mb-[16px] rounded-[16px] border-2 border-gray-100 bg-gray-50',
        'tablet:mb-[24px]',
      )}
    >
      {/* 최다 추천 번역 상단 섹션 */}
      <div
        className={cn(
          'relative p-[44px_16px_0_16px]',
          'tablet:p-[42px_16px_0_16px]',
          'desktop:p-[53px_24px_0_24px]',
        )}
      >
        <div>
          {/* 최다 추천 번역 뱃지 */}
          <span
            className={cn(
              'absolute top-0 left-0 flex items-center gap-[4px] justify-center w-[128px] h-[34px]',
              'rounded-br-[14px] rounded-tl-[14px] text-13-medium text-white bg-brand-black',
            )}
          >
            <Image src={IcMedal} width={16} height={16} alt="" />
            최다 추천 번역
          </span>

          {/* 작성자 정보, 좋아요 수, 등록 날짜 */}
          <div
            className={cn(
              'flex items-center pb-[12px] mb-[16px] border-b border-gray-200',
            )}
          >
            <div
              className={cn(
                'flex gap-[8px] items-center mr-[16px] text-12-medium text-gray-800',
                'tablet:mb-0',
              )}
            >
              <Image
                src={ImgUser}
                width={24}
                height={24}
                alt={`${submission.user.nickname} 이미지` || '사용자'}
              />
              <div
                className={cn(
                  'flex flex-col',
                  'tablet:flex-row tablet:items-center tablet:gap-[6px]',
                )}
              >
                <p className={cn('text-14-medium text-gray-800')}>
                  {submission.user.nickname || '사용자'}
                </p>
                <p className={cn('text-12-medium text-gray-500')}>
                  {submission.user.grade === 'GENERAL' ? '일반' : '전문가'}
                </p>
              </div>
            </div>

            {/* 좋아요 버튼 */}
            <ButtonLike
              className={cn(
                'text-13-medium text-gray-500',
                'tablet:text-14-medium',
              )}
              size="lg"
              count={submission._count.likes}
              status={likeStatus}
              onClick={handleToggleLike}
            />
            <p className={cn('ml-auto text-14-regular text-gray-400')}>
              {formatDate(submission.updatedAt, true, 'slash')}
            </p>
          </div>
        </div>

        {/* 본문 섹션 */}
        <div
          ref={contentRef}
          style={open ? { height } : undefined}
          className={cn(
            'overflow-hidden transition-[height] duration-300 ease-in-out',
            !open && 'h-[220px] tablet:h-[188px] desktop:h-[179px]',
          )}
        >
          <p
            className={cn('text-body-14-160 text-gray-800', 'text-body-16-160')}
          >
            {submission.content}
          </p>
        </div>
      </div>

      {/* 더보기 버튼 섹션 */}
      {height > collapsedHeight && (
        <button
          className={cn(
            'flex justify-center items-center gap-[4px] w-[100%] text-14-medium text-gray-800 py-[4px_12px] cursor-pointer',
            'tablet:text-16-medium',
          )}
          type="button"
          onClick={toggleOpen}
        >
          {open ? '접기' : '더보기'}
          <Image
            className={cn(!!open && 'rotate-180')}
            src={IcDownBracket}
            width={24}
            height={24}
            alt=""
          />
        </button>
      )}
    </article>
  );
}
