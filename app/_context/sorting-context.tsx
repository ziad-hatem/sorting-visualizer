"use client";
import React, { useEffect, useRef, useState } from "react";
export type SortingContextType = {
  array: number[];
  setArray: React.Dispatch<React.SetStateAction<number[]>>;
  algorithm: string;
  setAlgorithm: (algorithm: string) => void;
  isSorting: boolean;
  setIsSorting: React.Dispatch<React.SetStateAction<boolean>>;
  speed: number;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  resetArray: () => void;
  bubbleSort: () => Promise<void>;
  insertionSort: () => Promise<void>;
  heapSort: () => Promise<void>;
  stopSorting: boolean;
  handleQuickSort: () => Promise<void>;
  handleMergeSort: () => Promise<void>;
  selectionSort: () => Promise<void>;
  activeIndices: number[];
  setActiveIndices: React.Dispatch<React.SetStateAction<number[]>>;
  controllerRef: React.MutableRefObject<{ cancel: boolean }>;
  arrayLength: number;
  setArrayLength: React.Dispatch<React.SetStateAction<number>>;
  elapsedTime: number;
  shellSort: () => Promise<void>;
  radixSort: () => Promise<void>;
  countingSort: () => Promise<void>;
};

export const SortingContext = React.createContext<
  SortingContextType | undefined
>(undefined);

export const SortingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<string | null>(null);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(10);
  const [stopSorting, setStopSorting] = useState(false);
  const [arrayLength, setArrayLength] = useState<number>(100);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const controllerRef = useRef({ cancel: false });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetArray = () => {
    const newArray = Array.from({ length: 100 }, () =>
      Math.floor(Math.random() * 500)
    );
    setArray(newArray);
  };
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    const updateArrayLength = () => {
      const width = window.innerWidth;
      const newLength = Math.floor(width / 10);
      setArrayLength(newLength);
      resetArray();
    };

    window.addEventListener("resize", updateArrayLength);
    updateArrayLength();

    return () => window.removeEventListener("resize", updateArrayLength);
  }, []);

  useEffect(() => {
    if (isSorting) {
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isSorting]);

  const bubbleSort = async () => {
    try {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          if (controllerRef.current.cancel) throw new Error("Cancelled");
          setActiveIndices([j, j + 1]);
          if (array[j] > array[j + 1]) {
            let temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
            setArray([...array]);
          }
          await sleep(speed);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setActiveIndices([]);
      setIsSorting(false);
    }
  };

  const insertionSort = async () => {
    try {
      const arr = array.slice();
      for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          if (controllerRef.current.cancel) throw new Error("Cancelled");
          setActiveIndices([j, j + 1]);
          arr[j + 1] = arr[j];
          j = j - 1;
          setArray([...arr]);
          await sleep(speed);
        }
        arr[j + 1] = key;
        setArray([...arr]);
        await sleep(speed);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setActiveIndices([]);
      setIsSorting(false);
    }
  };

  const quickSort = async (arr: number[], low: number, high: number) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };

  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      setActiveIndices([j, high]);
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
      }
      await sleep(speed);
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(speed);
    return i + 1;
  };

  const handleQuickSort = async () => {
    setIsSorting(true);
    controllerRef.current.cancel = false;
    const arr = array.slice();
    try {
      await quickSort(arr, 0, arr.length - 1);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setArray([...arr]);
      setIsSorting(false);
    }
  };

  const mergeSort = async (arr: number[], l: number, r: number) => {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
  };

  const merge = async (arr: number[], l: number, m: number, r: number) => {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = arr.slice(l, m + 1);
    const R = arr.slice(m + 1, r + 1);
    let i = 0,
      j = 0,
      k = l;
    while (i < n1 && j < n2) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      setActiveIndices([k]);
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      setArray([...arr]);
      await sleep(speed);
      k++;
    }
    while (i < n1) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      setActiveIndices([k]);
      arr[k] = L[i];
      i++;
      k++;
      setArray([...arr]);
      await sleep(speed);
    }
    while (j < n2) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      setActiveIndices([k]);
      arr[k] = R[j];
      j++;
      k++;
      setArray([...arr]);
      await sleep(speed);
    }
  };

  const handleMergeSort = async () => {
    setIsSorting(true);
    controllerRef.current.cancel = false;
    const arr = array.slice();
    try {
      await mergeSort(arr, 0, arr.length - 1);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setArray([...arr]);
      setIsSorting(false);
    }
  };

  const selectionSort = async () => {
    setIsSorting(true);
    controllerRef.current.cancel = false;
    const arr = array.slice();
    try {
      for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
          if (controllerRef.current.cancel) throw new Error("Cancelled");
          setActiveIndices([i, j]);
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
          await sleep(speed);
        }
        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          setArray([...arr]);
          await sleep(speed);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setActiveIndices([]);
      setIsSorting(false);
    }
  };

  const heapSort = async () => {
    setIsSorting(true);
    controllerRef.current.cancel = false;
    const arr = array.slice();

    const heapify = async (n: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        if (controllerRef.current.cancel) throw new Error("Cancelled");
        setActiveIndices([i, left]);
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < n) {
        if (controllerRef.current.cancel) throw new Error("Cancelled");
        setActiveIndices([i, right]); // Set active indices
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        setArray([...arr]);
        await sleep(speed);
        await heapify(n, largest);
      }
    };

    const n = arr.length;

    try {
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
      }

      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setArray([...arr]);
        await sleep(speed);
        await heapify(i, 0);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setActiveIndices([]);
      setIsSorting(false);
    }
  };

  const shellSort = async () => {
    setIsSorting(true);
    controllerRef.current.cancel = false;
    const arr = array.slice();
    const n = arr.length;

    try {
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
          let temp = arr[i];
          let j;
          for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
            if (controllerRef.current.cancel) throw new Error("Cancelled");
            setActiveIndices([j, j - gap]);
            arr[j] = arr[j - gap];
            setArray([...arr]);
            await sleep(speed);
          }
          arr[j] = temp;
          setArray([...arr]);
          await sleep(speed);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setActiveIndices([]);
      setIsSorting(false);
    }
  };

  const getMax = (arr: number[]) => {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) max = arr[i];
    }
    return max;
  };

  const countingSortForRadix = async (arr: number[], exp: number) => {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
      count[Math.floor(arr[i] / exp) % 10]--;
    }

    for (let i = 0; i < n; i++) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      arr[i] = output[i];
      setActiveIndices([i]);
      setArray([...arr]);
      await sleep(speed);
    }
  };

  const radixSort = async () => {
    setIsSorting(true);
    controllerRef.current.cancel = false;
    const arr = array.slice();
    const max = getMax(arr);

    try {
      for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        if (controllerRef.current.cancel) throw new Error("Cancelled");
        await countingSortForRadix(arr, exp);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setActiveIndices([]);
      setIsSorting(false);
    }
  };

const countingSort = async () => {
  setIsSorting(true);
  controllerRef.current.cancel = false;
  const arr = array.slice();
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(Math.max(...arr) + 1).fill(0);

  try {
    for (let i = 0; i < n; i++) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      count[arr[i]]++;
    }

    for (let i = 1; i < count.length; i++) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      output[count[arr[i]] - 1] = arr[i];
      count[arr[i]]--;
    }

    for (let i = 0; i < n; i++) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      arr[i] = output[i];
      setActiveIndices([i]);
      setArray([...arr]);
      await sleep(speed);
    }
  } catch (error: any) {
    console.log(error.message);
  } finally {
    setActiveIndices([]);
    setIsSorting(false);
  }
};
  return (
    <SortingContext.Provider
      value={{
        array,
        setArray,
        algorithm: algorithm || "",
        setAlgorithm,
        isSorting,
        setIsSorting,
        speed,
        setSpeed,
        resetArray,
        bubbleSort,
        insertionSort,
        handleQuickSort,
        handleMergeSort,
        selectionSort,
        heapSort,
        shellSort,
        stopSorting,
        activeIndices,
        setActiveIndices,
        controllerRef,
        arrayLength: arrayLength || 0,
        setArrayLength,
        elapsedTime,
        radixSort,
        countingSort,
      }}
    >
      {children}
    </SortingContext.Provider>
  );
};
