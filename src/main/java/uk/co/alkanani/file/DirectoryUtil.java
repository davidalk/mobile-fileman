package uk.co.alkanani.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.co.alkanani.json.SubDirectoriesJson;

import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

public class DirectoryUtil {
    private static final Logger logger = LoggerFactory.getLogger(DirectoryUtil.class);

    public static SubDirectoriesJson getSubDirectories(String start) {
        FileSystem fileSystem = FileSystems.getDefault();
        Path startPath = fileSystem.getPath(start);

        SubDirectoriesJson json = new SubDirectoriesJson();

        try (Stream<Path> directoryStream = Files.list(startPath)) {
            directoryStream
                    .filter(path -> Files.isDirectory(path) && Files.isReadable(path) && !isHidden(path))
                    .map(path -> path.toFile().getName())
                    .forEach(json.subDirectories::add);
        } catch (IOException e) {
            logger.error("Failed to access directory stream", e);
        }

        return json;
    }

    private static boolean isHidden(Path path) {
        try {
            return Files.isHidden(path);
        } catch (IOException e) {
            logger.error("Unable to check for hidden path", e);
            return true;
        }
    }

}
