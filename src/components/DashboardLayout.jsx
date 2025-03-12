<div className="grid grid-cols-1 gap-4">
  {/* Calendar & Day Wise in a single container */}
  <div className="flex flex-col space-y-4">
    {/* Calendar */}
    <div className="bg-[#0D2A45] p-4 rounded-lg shadow-lg text-white">
      <h3 className="text-lg font-semibold flex items-center">📅 Calendar</h3>
      <Calendar
        onChange={setDate}
        value={date}
        className="custom-calendar"
      />
    </div>

    {/* Day Wise Tasks */}
    <div className="bg-[#0D2A45] p-4 rounded-lg shadow-lg text-white">
      <h3 className="text-lg font-semibold flex items-center">📅 Day Wise</h3>
      <div className="mt-2">
        <p className="bg-gray-900 p-3 rounded-lg">Task A</p>
      </div>
    </div>
  </div>
</div>
