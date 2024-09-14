"use client";
import { PauseIcon, PlayIcon, ResetIcon } from "@radix-ui/react-icons";
import { useContext, useEffect } from "react";
import { SortingContext } from "../_context/sorting-context";
import { algorithms } from "../_data/algorithms";
import { SelectAlgorithm } from "./select-algorithm";
import { SlideSpeed } from "./slide-speed";
import { Button } from "../../components/ui/button";

const SortingVisualizer = () => {
  const {
    array,
    algorithm,
    isSorting,
    setIsSorting,
    speed,
    setSpeed,
    resetArray,
    bubbleSort,
    insertionSort,
    selectionSort,
    handleMergeSort,
    heapSort,
    handleQuickSort,
    activeIndices,
    controllerRef,
  } = useContext<any>(SortingContext);
  useEffect(() => {
    resetArray();
  }, [resetArray]);

  const getFunction = (algorithm: string) => {
    switch (algorithm) {
      case "bubble-sort":
        return bubbleSort;
      case "quick-sort":
        return handleQuickSort;
      case "merge-sort":
        return handleMergeSort;
      case "insertion-sort":
        return insertionSort;
      case "selection-sort":
        return selectionSort;
      case "heap-sort":
        return heapSort;
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col gap-10 pb-16">
      <div className="flex items-center justify-center gap-5">
        <div className="flex items-center gap-2">
          <p className="text-white">fast</p>
          <SlideSpeed speed={speed} setSpeed={setSpeed} />
          <p className="text-white">slow</p>
        </div>
        <SelectAlgorithm algorithms={algorithms} />
        <div className="flex items-center gap-2">
          <Button onClick={resetArray} disabled={isSorting}>
            <ResetIcon className="w-4 h-4" />
          </Button>
          <Button
            disabled={algorithm == null ? true : false}
            onClick={() => {
              if (isSorting) {
                setIsSorting(false);
                controllerRef.current.cancel = true;
              } else {
                setIsSorting(true);
                controllerRef.current.cancel = false;
                getFunction(algorithm)?.();
              }
            }}
          >
            {isSorting ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex gap-2 rotate-180">
        {array.map((value: number, idx: number) => (
          <div
            key={idx}
            style={{ height: `${value}px` }}
            className={`w-1 ${
              activeIndices.includes(idx)
                ? "bg-green-800" // Color for active elements
                : "bg-gradient-to-r from-slate-200 to-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;
