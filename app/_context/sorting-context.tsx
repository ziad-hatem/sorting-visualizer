"use client";
import React, { useRef, useState } from "react";

// Remove the unused import
// import * as d3 from 'd3';

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
  const [speed, setSpeed] = useState<number>(100);
  const [stopSorting, setStopSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const controllerRef = useRef({ cancel: false });

  const resetArray = () => {
    const newArray = Array.from({ length: 100 }, () =>
      Math.floor(Math.random() * 500)
    );
    setArray(newArray);
  };
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const bubbleSort = async () => {
    try {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          if (controllerRef.current.cancel) throw new Error("Cancelled");
          setActiveIndices([j, j + 1]); // Set active indices
          if (array[j] > array[j + 1]) {
            // Swap elements
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
      setActiveIndices([]); // Clear active indices
      setIsSorting(false); // Reset sorting state when done
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
          setActiveIndices([j, j + 1]); // Set active indices
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
      setActiveIndices([]); // Clear active indices
      setIsSorting(false); // Reset sorting state when done
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
      setActiveIndices([j, high]); // Set active indices
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
    controllerRef.current.cancel = false; // Reset cancel flag
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
      setActiveIndices([k]); // Set active index
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
      setActiveIndices([k]); // Set active index
      arr[k] = L[i];
      i++;
      k++;
      setArray([...arr]);
      await sleep(speed);
    }
    while (j < n2) {
      if (controllerRef.current.cancel) throw new Error("Cancelled");
      setActiveIndices([k]); // Set active index
      arr[k] = R[j];
      j++;
      k++;
      setArray([...arr]);
      await sleep(speed);
    }
  };

  const handleMergeSort = async () => {
    setIsSorting(true);
    controllerRef.current.cancel = false; // Reset cancel flag
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
    controllerRef.current.cancel = false; // Reset cancel flag
    const arr = array.slice();
    try {
      for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
          if (controllerRef.current.cancel) throw new Error("Cancelled");
          setActiveIndices([i, j]); // Set active indices
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
      setActiveIndices([]); // Clear active indices
      setIsSorting(false);
    }
  };

  const heapSort = async () => {
    setIsSorting(true); // Start sorting
    controllerRef.current.cancel = false; // Reset cancel flag
    const arr = array.slice();

    const heapify = async (n: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        if (controllerRef.current.cancel) throw new Error("Cancelled");
        setActiveIndices([i, left]); // Set active indices
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
      setActiveIndices([]); // Clear active indices
      setIsSorting(false); // End sorting
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
        stopSorting,
        activeIndices,
        setActiveIndices,
        controllerRef,
      }}
    >
      {children}
    </SortingContext.Provider>
  );
};
