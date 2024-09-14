import SortingVisualizer from "./_components/sorting-visualizer";

export default function Home() {
  return (
    <div className="w-full h-fit overflow-x-hidden">
      <div className="relative h-full w-full bg-slate-950">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="flex items-center justify-center flex-col gap-20 h-fit pt-32">
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-5xl pb-3 font-semibold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Sorting Visualizer <br />
              Algorithms
            </h1>
          </div>
          <div className="flex items-center justify-center">
            <SortingVisualizer />
          </div>
        </div>
      </div>
    </div>
  );
}
