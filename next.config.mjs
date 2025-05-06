/** @type {import('next').NextConfig} */
import { copyFile, mkdir } from "fs/promises";
import { join } from "path";
import * as fs from "node:fs";

const nextConfig = {
  webpack(config, { isServer }) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    config.plugins.push(
      new (class {
        apply(compiler) {
          compiler.hooks.afterEmit.tapPromise(
            "CopyWasmPlugin",
            async (compilation) => {
              if (isServer) {
                const outputPath = compilation.outputOptions.path;

                const staticWasmDir = join(outputPath, "static", "wasm");
                await mkdir(staticWasmDir, { recursive: true }).catch(() => {});

                console.log("Output path:", outputPath);
                console.log("Static WASM dir:", staticWasmDir);

                const searchDirs = [
                  join(outputPath, "chunks"),
                  outputPath,
                  join(outputPath, "app"),
                  join(outputPath, "pages"),
                  join(outputPath, "..", "static"),
                ];

                for (const dir of searchDirs) {
                  if (fs.existsSync(dir)) {
                    console.log(`Searching for WASM files in: ${dir}`);
                    const wasmFiles = findWasmFiles(dir);
                    console.log(
                      `Found ${wasmFiles.length} WASM files in ${dir}`
                    );

                    for (const wasmFile of wasmFiles) {
                      const fileName = wasmFile.split("/").pop();
                      const destPath = join(staticWasmDir, fileName);

                      try {
                        await copyFile(wasmFile, destPath);
                        console.log(
                          `Successfully copied ${fileName} to ${destPath}`
                        );
                      } catch (error) {
                        console.warn(
                          `Warning copying WASM file ${fileName}:`,
                          error
                        );
                      }
                    }
                  } else {
                    console.log(`Directory doesn't exist: ${dir}`);
                  }
                }
              }
            }
          );
        }
      })()
    );

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

function findWasmFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results.push(...findWasmFiles(filePath));
    } else if (file.endsWith(".wasm")) {
      results.push(filePath);
    }
  }

  return results;
}

export default nextConfig;
