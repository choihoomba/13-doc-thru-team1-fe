import Image from 'next/image';

import IcLanding1 from '@/app/assets/icons/icon_lading1.svg';
import IcLanding2 from '@/app/assets/icons/icon_lading2.svg';
import IcLanding3 from '@/app/assets/icons/icon_lading3.svg';
import ImgLanding1Lg from '@/app/assets/images/img_landing1_lg.svg';
import ImgLanding1Sm from '@/app/assets/images/img_landing1_sm.svg';
import ImgLanding2Lg from '@/app/assets/images/img_landing2_lg.svg';
import ImgLanding2Sm from '@/app/assets/images/img_landing2_sm.svg';
import ImgLanding3Lg from '@/app/assets/images/img_landing3_lg.svg';
import ImgLanding3Sm from '@/app/assets/images/img_landing3_sm.svg';
import ImgLandingBgLg from '@/app/assets/images/img_landing_bg_lg.svg';
import ImgLandingBgMd from '@/app/assets/images/img_landing_bg_md.svg';
import ImgLandingBgSm from '@/app/assets/images/img_landing_bg_sm.svg';
import ImgLandingLogo from '@/app/assets/images/img_landing_logo.svg';

import { cn } from '@/utils/cn';

import CtaLinkButton from '@/components/auth/landing/CtaLinkButton.jsx';
import Divider from '@/components/auth/landing/Divider.jsx';

/** 랜딩 페이지 */
export default function LandingPage() {
  return (
    <main className={cn('bg-gray-100')}>
      {/* 히어로 섹션 */}
      <header className={cn('relative')}>
        {/*화면 크기 감지 훅 대신 CSS로 반응형 전환 
        LandingPage 서버 컴포넌트 상태 유지 목적 */}
        <Image
          src={ImgLandingBgSm}
          alt=""
          priority
          className={cn('w-full h-auto', 'tablet:hidden')}
        />
        <Image
          src={ImgLandingBgMd}
          alt=""
          priority
          className={cn(
            'hidden w-full h-auto',
            'tablet:block',
            'desktop:hidden',
          )}
        />
        <Image
          src={ImgLandingBgLg}
          alt=""
          priority
          className={cn('hidden w-full h-auto', 'desktop:block')}
        />
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center',
          )}
        >
          <Image
            src={ImgLandingLogo}
            alt="Docthru"
            width={126}
            height={29}
            priority
            className={cn(
              'translate-x-[-8.5px] mb-2.75',
              'tablet:translate-x-0 tablet:mb-[15.65px]',
            )}
          />
          <h1
            className={cn(
              'text-20-semibold text-white text-center leading-7 mb-[23.65px]',
              'tablet:text-24-semibold tablet:mb-6.5',
            )}
          >
            함께 번역하며 성장하는
            <br />
            개발자의 새로운 영어 습관
          </h1>
          <CtaLinkButton className="bg-white text-brand-black" />
        </div>
      </header>

      {/* 섹션2 */}
      <section
        className={cn(
          'mt-9.5',
          'desktop:mt-22.25 desktop:flex desktop:items-start desktop:gap-16 desktop:w-235.75 desktop:mx-auto',
        )}
      >
        <div
          className={cn(
            'flex flex-col pl-5.25 pr-11.25 mb-5.5',
            'tablet:pl-29.5 tablet:pr-79.25 tablet:mb-7.75',
            'desktop:pl-0 desktop:pr-0 desktop:mb-0 desktop:w-77.25 desktop:shrink-0',
          )}
        >
          <Image
            src={IcLanding1}
            alt=""
            width={24}
            height={24}
            className={cn('mb-2')}
          />
          <h2 className={cn('text-20-bold text-black mb-3 leading-7')}>
            혼자서는 막막했던 번역,
            <br /> 챌린지로 함께 완성하기
          </h2>
          <p className={cn('text-16-regular text-gray-550')}>
            중요한 건 꺾이지 않는 마음! 동료들과 함께
            <br />
            기술 문서를 번역해 보세요.
          </p>
        </div>
        <div className={cn('desktop:w-142.5 desktop:shrink-0')}>
          <Image
            src={ImgLanding1Sm}
            alt=""
            className={cn('w-full h-auto px-4', 'tablet:hidden')}
          />
          <Image
            src={ImgLanding1Lg}
            alt=""
            className={cn(
              'hidden w-full h-auto',
              'tablet:block tablet:px-21.75',
              'desktop:px-0',
            )}
          />
        </div>
      </section>
      <Divider />
      {/* 섹션3 */}
      <section
        className={cn(
          'mt-9.5',
          'desktop:mt-22.25 desktop:flex desktop:items-start desktop:gap-16 desktop:w-235.75 desktop:mx-auto',
        )}
      >
        <div
          className={cn(
            'flex flex-col pl-5.25 pr-11.25 mb-5.5',
            'tablet:pl-29.5 tablet:pr-79.25 tablet:mb-7.75',
            'desktop:pl-0 desktop:pr-0 desktop:mb-0 desktop:w-77.25 desktop:shrink-0',
          )}
        >
          <Image
            src={IcLanding2}
            alt=""
            width={24}
            height={24}
            className={cn('mb-2')}
          />
          <h2 className={cn('text-20-bold text-black mb-3 leading-7')}>
            내가 좋아하는 기술 번역,
            <br />
            내가 필요한 기술 번역
          </h2>
          <p className={cn('text-16-regular text-gray-550')}>
            이미 진행 중인 번역 챌린지에 참여하거나,
            <br />
            새로운 번역 챌린지를 시작해 보세요.
          </p>
        </div>
        <div className={cn('desktop:w-142.5 desktop:shrink-0')}>
          <Image
            src={ImgLanding2Sm}
            alt=""
            className={cn('w-full h-auto', 'tablet:hidden')}
          />
          <Image
            src={ImgLanding2Lg}
            alt=""
            className={cn(
              'hidden w-full h-auto',
              'tablet:block tablet:px-21.75',
              'desktop:px-0',
            )}
          />
        </div>
      </section>
      <Divider />
      {/* 섹션4 */}
      <section
        className={cn(
          'mt-9.5 mb-13.25',
          'desktop:mt-22.25 desktop:flex desktop:items-start desktop:gap-16 desktop:w-235.75 desktop:mx-auto',
        )}
      >
        <div
          className={cn(
            'flex flex-col pl-5.25 pr-11.25 mb-5.5',
            'tablet:pl-29.5 tablet:pr-79.25 tablet:mb-7.75',
            'desktop:pl-0 desktop:pr-0 desktop:mb-0 desktop:w-77.25 desktop:shrink-0',
          )}
        >
          <Image
            src={IcLanding3}
            alt=""
            width={24}
            height={24}
            className={cn('mb-2')}
          />
          <h2 className={cn('text-20-bold text-black mb-3 leading-7')}>
            피드백으로 함께 성장하기
          </h2>
          <p className={cn('text-16-regular text-gray-550')}>
            번역 작업물에 대해 피드백을 주고 받으며
            <br />
            영어 실력은 물론, 개발 실력까지 키워 보세요.
          </p>
        </div>
        <div className={cn('desktop:w-142.5 desktop:shrink-0')}>
          <Image
            src={ImgLanding3Sm}
            alt=""
            className={cn('w-full h-auto px-4', 'tablet:hidden')}
          />
          <Image
            src={ImgLanding3Lg}
            alt=""
            className={cn(
              'hidden w-full h-auto',
              'tablet:block tablet:px-21.75',
              'desktop:px-0',
            )}
          />
        </div>
      </section>
      {/* 섹션5 */}
      <section
        className={cn(
          'flex flex-col items-center justify-center gap-5 pb-22.25',
          'tablet:pb-33.75',
          'desktop:pb-30.75',
        )}
      >
        <h2 className={cn('text-18-semibold text-black text-center')}>
          함께 번역하고 성장하세요!
        </h2>
        <CtaLinkButton />
      </section>
    </main>
  );
}
