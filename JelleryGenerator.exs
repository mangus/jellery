
defmodule JelleryGenerator do

  def start do
    JelleryGenerator.check_arguments
  end

	def check_arguments do
		case length(System.argv) do
			0 ->
				IO.puts "Please specify start directory as first command line argument"
			1 ->
				[start_dir | _] = System.argv
				if File.exists?(start_dir) do
					welcome start_dir
				else
					IO.puts "The path does not exist: " <> start_dir
				end
			_ ->
				IO.puts "Only one argument, please."
		end
	end

	def welcome(start_dir) do
		IO.puts "\nThis fancy gallery generator is going to find image files"
			<> "\nfrom directory specified as first command line argument:"
		IO.puts "    " <> start_dir
		IO.puts "and create complete HTML image gallery into current working directory:"
		{:ok, current_dir} = File.cwd
		IO.puts "    " <> current_dir <> "/jellery\n"
		lets_go = IO.gets "If that's what You want to do, smash ENTER to continue\n"
		if lets_go == "\n" do
		  start_process(start_dir)
		end
	end
	
	def start_process(start_dir) do
		  MemoryDatabase.start()
		  MemoryDatabase.set_path(start_dir)
			Processor.process_files([start_dir])
	end

end

defmodule Processor do

	def process_files([first_file | other_files]) do
		if File.dir?(first_file) and !String.contains?(first_file, "crap") do
			IO.puts "Processing directory: " <> first_file
			{:ok, files} = File.ls first_file
			with_full_path = Enum.map(files, fn(filename) -> Path.join(first_file, filename) end)
  	  process_files with_full_path
		else
			if String.ends_with?(first_file, [".jpg"]) do
        IO.puts "Processing file: " <> first_file
  			filename_with_relative_path = String.trim_leading(first_file, MemoryDatabase.get_path())
	  		Keywords.get_keywords filename_with_relative_path
	  	end
		end
		process_files other_files
	end

	def process_files([]) do
	end

end

defmodule Keywords do
  def get_keywords(path_and_filename) do
    to_keywords = String.replace(path_and_filename, ~r/\(.{0,}\)/, "") # Remove text in brackets
    to_keywords = String.trim_trailing(to_keywords, ".jpg")
    words = String.split(to_keywords, [" /", "  ", "/", " "])
    Enum.map words, fn word ->
      if !String.match?(word, ~r/^\d{0,}$/) do
        MemoryDatabase.add_keyword word, path_and_filename
      end
      word
    end
  end
end

defmodule MemoryDatabase do

  def start() do
    {:ok, pid} = Agent.start_link(fn -> %{} end)
    Process.register(pid, :memory_database)
    Agent.update(:memory_database, fn db -> Map.put(db, :keywords, %{}) end)
  end
  
  def set_path(start_path) do
    Agent.update(:memory_database, fn db -> Map.put(db, :start_path, start_path) end)
  end
  
  def get_path() do
    Agent.get(:memory_database, fn db -> Map.get(db, :start_path) end)
  end

  def add_keyword(keyword, file) do
    keywords = Agent.get(:memory_database, fn db -> Map.get(db, :keywords) end)
    new_keywords = if Map.get(keywords, keyword) do
      file_list = Map.get(keywords, keyword)
      new_list = file_list ++ [file]
      Map.put(keywords, keyword, new_list)
    else
      Map.put(keywords, keyword, [file])
    end
    Agent.update(:memory_database, fn db -> Map.put(db, :keywords, new_keywords) end)
  end

  def get_keywords() do
    Agent.get(:memory_database, fn db -> Map.get(db, :keywords) end)
  end
  
end

JelleryGenerator.start
IO.inspect MemoryDatabase.get_keywords

