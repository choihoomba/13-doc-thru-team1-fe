/** 작업 도전하기 페이지 */
'use client';

import React, { useState } from 'react';
import {
  Editor,
  EditorProvider,
  Toolbar,
  createButton,
} from 'react-simple-wysiwyg';

import Image from 'next/image';

import iconAlignCenter from '@/app/assets/icons/icon_font_alignment_center.svg';
import iconAlignLeft from '@/app/assets/icons/icon_font_alignment_left.svg';
import iconAlignRight from '@/app/assets/icons/icon_font_alignment_right.svg';
import iconBold from '@/app/assets/icons/icon_font_bold.svg';
import iconBullet from '@/app/assets/icons/icon_font_bullet.svg';
import iconColor from '@/app/assets/icons/icon_font_color.svg';
import iconItalic from '@/app/assets/icons/icon_font_italic.svg';
import iconNumbering from '@/app/assets/icons/icon_font_numbering.svg';
import iconUnderline from '@/app/assets/icons/icon_font_underline.svg';

import { cn } from '@/utils/cn';

const title = '나중에 api 연결';
const BtnBold = createButton(
  'Bold',
  <Image src={iconBold} alt="Bold" width={20} height={20} />,
  'bold',
);
const BtnItalic = createButton(
  'Italic',
  <Image src={iconItalic} alt="Italic" width={20} height={20} />,
  'italic',
);
const BtnUnderline = createButton(
  'Underline',
  <Image src={iconUnderline} alt="Underline" width={20} height={20} />,
  'underline',
);
const BtnAlignLeft = createButton(
  'Align left',
  <Image src={iconAlignLeft} alt="Align left" width={20} height={20} />,
  'justifyLeft',
);
const BtnAlignCenter = createButton(
  'Align center',
  <Image src={iconAlignCenter} alt="Align center" width={20} height={20} />,
  'justifyCenter',
);
const BtnAlignRight = createButton(
  'Align right',
  <Image src={iconAlignRight} alt="Align right" width={20} height={20} />,
  'justifyRight',
);
const BtnBulletList = createButton(
  'Bullet list',
  <Image src={iconBullet} alt="Bullet list" width={20} height={20} />,
  'insertUnorderedList',
);
const BtnNumberedList = createButton(
  'Numbered list',
  <Image src={iconNumbering} alt="Numbered list" width={20} height={20} />,
  'insertOrderedList',
);

export default function NewSubmissionPage() {
  const [value, setValue] = useState('');

  function onChange(e) {
    setValue(e.target.value);
  }

  // 글자 색상 변경 함수
  function changeTextColor(color) {
    document.execCommand('foreColor', false, color);
  }

  return (
    <div
      className={cn(
        'mt-6 flex h-screen w-full flex-col gap-6 px-4',
        'tablet:px-6',
        'desktop:mx-auto desktop:max-w-300',
      )}
    >
      {/* <Header /> */}
      <h1 className={cn('text-20-semibold')}>{title}</h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="891"
        height="1"
        viewBox="0 0 891 1"
        fill="none"
      >
        <path
          d="M0.5 0.5H890.5"
          className={cn('stroke-gray-200')}
          strokeLinecap="round"
        />
      </svg>
      <EditorProvider>
        <Editor
          value={value}
          onChange={onChange}
          placeholder={'번역 내용을 적어주세요.'}
          containerProps={{
            className: cn(
              '[&_.rsw-ce:empty:not(:focus)::before]:text-gray-400!',
              'border-none!',
              '[&_.rsw-toolbar]:border-none!',
              '[&_.rsw-toolbar]:bg-white!',
              '[&_.rsw-ce:focus]:outline-none!',
            ),
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnAlignLeft />
            <BtnAlignCenter />
            <BtnAlignRight />
            <BtnBulletList />
            <BtnNumberedList />

            {/* 커스텀 글자 색상 버튼: 아이콘 위에 네이티브 select를 투명하게 겹쳐서 클릭 시 드롭다운이 열리게 함 */}
            <div
              className={cn(
                'relative inline-flex h-[2em] w-[2em] items-center justify-center',
              )}
            >
              <Image src={iconColor} alt="글자 색상" width={20} height={20} />
              <select
                onChange={(e) => changeTextColor(e.target.value)}
                className={cn('absolute inset-0 cursor-pointer opacity-0')}
              >
                {/* 밤티나는 dropdown 수정 필요  */}
                <option value="">색상 선택</option>
                <option value="red">빨간색</option>
                <option value="blue">파란색</option>
                <option value="green">초록색</option>
                <option value="black">검은색</option>
              </select>
            </div>
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}
