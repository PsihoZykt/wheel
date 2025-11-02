import tinycolor from 'tinycolor2';
import { Key, useRef } from 'react';

import { WheelItem, WheelItemWithAngle } from '@models/wheel.model.ts';
import { fitText } from '@utils/common.utils.ts';
import { getSafeIndex2 } from '@utils/dataType/array.ts';
import { Ease, interpolate } from '@utils/dataType/function.utils.ts';

type DrawWheelFunc = (props: {
  items: WheelItemWithAngle[];
  wheelCanvas: HTMLCanvasElement;
  pointerCanvas: HTMLCanvasElement;
  getColor?: (item: WheelItem) => string;
  clear?: boolean;
}) => void;

type HighlightItemFunc = (
  id: Key,
  items: WheelItemWithAngle[],
  wheelCanvas: HTMLCanvasElement,
  pointerCanvas: HTMLCanvasElement,
) => void;

type EatAnimationFunc = (
  id: Key,
  items: WheelItemWithAngle[],
  wheelCanvas: HTMLCanvasElement,
  pointerCanvas: HTMLCanvasElement,
  duration?: number,
) => Promise<void>;

interface Result {
  drawWheel: DrawWheelFunc;
  highlightItem: HighlightItemFunc;
  eatAnimation: EatAnimationFunc;
}

const borderWidth = 3;
const maxTextLength = 21;
const selectorAngle = (Math.PI / 2) * 3;

const colorGetter = (item: WheelItem) => item.color || '#000';

// Кэш для загруженных изображений
const imageCache = new Map<string, HTMLImageElement>();

export const useWheelDrawer = (): Result => {
  const imagesLoadedRef = useRef<Set<string>>(new Set());
  const drawText = (
    ctx: CanvasRenderingContext2D,
    center: number,
    { startAngle, endAngle, name }: WheelItemWithAngle,
  ): void => {
    if ((endAngle - startAngle) / Math.PI / 2 < 0.016) {
      return;
    }

    const radius = center - 3;
    const text = fitText(name, maxTextLength);

    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = '22px Arial';
    ctx.textBaseline = 'middle';

    const offsetModifier = -text.length * 0.007 + 1.3;
    const textRadius = (radius - ctx.measureText(text).width) / offsetModifier;
    const centerAngle = endAngle - (endAngle - startAngle) / 2;
    const textCoords = {
      x: textRadius * Math.cos(centerAngle) + borderWidth,
      y: textRadius * Math.sin(centerAngle) + borderWidth,
    };

    ctx.translate(textCoords.x + radius, textCoords.y + radius);
    ctx.rotate(centerAngle);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };

  const drawSlice = (
    ctx: CanvasRenderingContext2D,
    center: number,
    item: WheelItemWithAngle,
    pieEdgeDefault?: { x: number; y: number },
    getColor = colorGetter,
    applyGrayscale = false,
  ): void => {
    const { startAngle, endAngle, image } = item;

    const pieEdge = pieEdgeDefault || { x: center, y: center };
    const radius = center - borderWidth;

    // Если есть изображение и НЕ нужен grayscale, используем его
    if (image && !applyGrayscale) {
      // Проверяем, есть ли изображение в кэше
      let img = imageCache.get(image);

      if (!img) {
        // Создаем новое изображение и добавляем в кэш
        img = new Image();
        img.src = image;
        imageCache.set(image, img);

        // Если изображение еще не загружено, используем цвет
        if (!imagesLoadedRef.current.has(image)) {
          img.onload = () => {
            imagesLoadedRef.current.add(image);
          };
          // Временно используем цвет
          ctx.fillStyle = getColor(item);
          ctx.beginPath();
          ctx.moveTo(pieEdge.x, pieEdge.y);
          ctx.arc(center, center, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Если изображение загружено, рисуем его
      if (img.complete && img.naturalWidth > 0) {
        // Сохраняем текущее состояние контекста
        ctx.save();

        // Создаем путь для сектора и устанавливаем его как область отсечения
        ctx.beginPath();
        ctx.moveTo(pieEdge.x, pieEdge.y);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.clip(); // Ограничиваем рисование формой сектора

        // Создаем временный canvas для масштабирования изображения
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
          // Устанавливаем размер временного canvas равным размеру сектора
          const sectorDiameter = radius * 2;
          tempCanvas.width = sectorDiameter;
          tempCanvas.height = sectorDiameter;

          // Рисуем изображение на весь временный canvas
          tempCtx.drawImage(img, 0, 0, sectorDiameter, sectorDiameter);

          // Создаем паттерн из временного canvas
          const pattern = ctx.createPattern(tempCanvas, 'no-repeat');

          if (pattern) {
            // Вычисляем центр сектора и угол поворота
            const centerAngle = (startAngle + endAngle) / 2;

            // Применяем трансформации
            ctx.translate(center, center);
            ctx.rotate(centerAngle - Math.PI / 2); // -PI/2 чтобы изображение было "вверх"
            ctx.translate(-center, -center);

            // Заполняем сектор паттерном
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, center * 2, center * 2);
          }
        }

        // Восстанавливаем контекст (убирает clip и трансформации)
        ctx.restore();
      } else {
        // Если изображение не загружено, используем цвет
        ctx.fillStyle = getColor(item);
        ctx.beginPath();
        ctx.moveTo(pieEdge.x, pieEdge.y);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      // Если изображения нет ИЛИ нужен grayscale - используем серый цвет
      ctx.fillStyle = applyGrayscale ? tinycolor('#808080').toHexString() : getColor(item);
      ctx.beginPath();
      ctx.moveTo(pieEdge.x, pieEdge.y);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
    }

    // Рисуем обводку (после fill, но перед текстом)
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.moveTo(pieEdge.x, pieEdge.y);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.moveTo(pieEdge.x, pieEdge.y);
    ctx.stroke();
  };

  const drawWheel: DrawWheelFunc = ({ items, wheelCanvas, pointerCanvas, getColor = colorGetter, clear = true }) => {
    const ctx = wheelCanvas.getContext('2d');
    const pointerCtx = pointerCanvas.getContext('2d');
    const radius = Number(wheelCanvas.width) / 2;

    if (ctx) {
      clear && ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
      items.forEach((item) => drawSlice(ctx, radius, item, undefined, getColor, false));
      items.forEach((item) => drawText(ctx, radius, item));
    }

    if (pointerCtx) {
      const preset: WheelItemWithAngle = {
        startAngle: selectorAngle - 0.12,
        endAngle: selectorAngle + 0.12,
        color: '#353535',
        id: 'pointer',
        name: 'pointer',
        amount: 0,
      };
      drawSlice(pointerCtx, radius, preset, { x: radius, y: 45 }, colorGetter, false);
    }
  };

  const highlightItem: HighlightItemFunc = (id, items, wheelCanvas, pointerCanvas) => {
    const ctx = wheelCanvas.getContext('2d');
    const pointerCtx = pointerCanvas.getContext('2d');
    const radius = Number(wheelCanvas.width) / 2;

    if (ctx) {
      ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

      items.forEach((item) => {
        const isHighlighted = item.id === id;
        const getColor = (item: WheelItem) =>
          isHighlighted ? item.color : tinycolor(item.color).greyscale().toHexString();
        const applyGrayscale = !isHighlighted && !!item.image;

        drawSlice(ctx, radius, item, undefined, getColor, applyGrayscale);
      });

      items.forEach((item) => drawText(ctx, radius, item));
    }

    if (pointerCtx) {
      const preset: WheelItemWithAngle = {
        startAngle: selectorAngle - 0.12,
        endAngle: selectorAngle + 0.12,
        color: '#353535',
        id: 'pointer',
        name: 'pointer',
        amount: 0,
      };
      drawSlice(pointerCtx, radius, preset, { x: radius, y: 45 }, colorGetter, false);
    }
  };

  const eatAnimation: EatAnimationFunc = (id, items, wheelCanvas, pointerCanvas, duration = 500) => {
    const removedItemIndex = items.findIndex((item) => item.id === id);

    const rotation = Number(wheelCanvas.style.transform.match(/\((.*)deg\)/)?.[1] ?? 0);

    const localRotation = ((rotation % 360) * Math.PI) / 180;
    let commonAngle = (3 * Math.PI) / 2 - localRotation;
    if (commonAngle < 0) commonAngle += 2 * Math.PI;

    const leftItem = items[getSafeIndex2(items, removedItemIndex - 1)];
    const rightItem = items[getSafeIndex2(items, removedItemIndex + 1)];

    return new Promise((resolve) => {
      let startTime: number | null = null;

      const draw = (progress: number) => {
        const involvedItems = [
          {
            ...leftItem,
            endAngle:
              commonAngle < leftItem.startAngle
                ? interpolate(leftItem.endAngle, commonAngle + 2 * Math.PI, progress, Ease.Quad)
                : interpolate(leftItem.endAngle, commonAngle, progress, Ease.Quad),
          },
          {
            ...rightItem,
            startAngle:
              commonAngle > rightItem.startAngle
                ? interpolate(rightItem.startAngle, commonAngle - 2 * Math.PI, progress, Ease.Quad)
                : interpolate(rightItem.startAngle, commonAngle, progress, Ease.Quad),
          },
        ];

        drawWheel({ items: involvedItems, wheelCanvas, pointerCanvas, clear: false });
      };

      const drawStep = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp;

          requestAnimationFrame(drawStep);
        }

        if (timestamp - startTime > duration) {
          draw(1);
          resolve();
          return;
        }

        const progress = (timestamp - startTime) / duration;

        draw(progress);
        requestAnimationFrame(drawStep);
      };

      requestAnimationFrame(drawStep);
    });
  };

  return { drawWheel, highlightItem, eatAnimation };
};
