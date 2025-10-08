import os
from pathlib import Path

SEARCH_DIRS = ['assets', 'components', 'contexts', 'hooks', 'types']

def find_ts_files(start_path):
    ts_files = []
    for dir_name in SEARCH_DIRS:
        full_dir_path = start_path / dir_name
        if not full_dir_path.exists() or not full_dir_path.is_dir():
            continue
        for root, _, files in os.walk(full_dir_path):
            for file in files:
                if file.endswith(('.ts', '.tsx')):
                    ts_files.append(Path(root) / file)
    return ts_files


def export_files_to_txt(files, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for file_path in files:
            try:
                outfile.write(f"Файл: {file_path}\n")
                outfile.write("=" * 80 + "\n")
                with open(file_path, 'r', encoding='utf-8') as infile:
                    content = infile.read()
                    outfile.write(content)
                outfile.write("\n" + "-" * 80 + "\n\n")
            except Exception as e:
                outfile.write(f"Ошибка чтения файла {file_path}: {str(e)}\n")
                outfile.write("-" * 80 + "\n\n")


def main():
    start_path = Path.cwd()
    print("🔍 Поиск TypeScript файлов...")
    print(f"📁 Ищем в: {start_path}")
    ts_files = find_ts_files(start_path)
    if not ts_files:
        print("❌ Файлы .ts и .tsx не найдены!")
        return

    print(f"✅ Найдено файлов: {len(ts_files)}")
    ts_files.sort()
    output_file = "selected_ts_files.txt"
    export_files_to_txt(ts_files, output_file)
    file_size = os.path.getsize(output_file) / (1024 * 1024)
    print(f"📄 Результат сохранён в: {output_file}")
    print(f"📊 Размер файла: {file_size:.2f} MB")
    print("Готово!")

if __name__ == "__main__":
    main()