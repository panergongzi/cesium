import {
  BatchTexturePipelineStage,
  ShaderBuilder,
} from "../../../Source/Cesium.js";
import ShaderBuilderTester from "../../ShaderBuilderTester.js";

describe("Scene/ModelExperimental/BatchTexturePipelineStage", function () {
  function expectUniformMap(uniformMap, expected) {
    for (var key in expected) {
      if (expected.hasOwnProperty(key)) {
        var expectedValue = expected[key];
        var uniformFunction = uniformMap[key];
        expect(uniformFunction).toBeDefined();
        expect(uniformFunction()).toEqual(expectedValue);
      }
    }
  }

  function verifyBatchTextureUniforms(propertyTable, uniformMap) {
    var expectedUniforms = {
      model_featuresLength: propertyTable.featuresLength,
      model_batchTexture: propertyTable.batchTexture.batchTexture,
      model_textureDimensions: propertyTable.batchTexture.textureDimensions,
      model_textureStep: propertyTable.batchTexture.textureStep,
    };

    expectUniformMap(uniformMap, expectedUniforms);
  }

  function verifyBatchTextureShaders(shaderBuilder) {
    ShaderBuilderTester.expectHasVertexDefines(shaderBuilder, [
      "MULTILINE_BATCH_TEXTURE",
    ]);

    ShaderBuilderTester.expectHasFragmentDefines(shaderBuilder, [
      "MULTILINE_BATCH_TEXTURE",
    ]);

    ShaderBuilderTester.expectHasVertexUniforms(shaderBuilder, [
      "uniform float model_featuresLength;",
      "uniform sampler2D model_batchTexture;",
      "uniform vec4 model_textureStep;",
      "uniform vec2 model_textureDimensions;",
    ]);

    ShaderBuilderTester.expectHasFragmentUniforms(shaderBuilder, [
      "uniform float model_featuresLength;",
      "uniform sampler2D model_batchTexture;",
      "uniform vec4 model_textureStep;",
      "uniform vec2 model_textureDimensions;",
    ]);
  }

  it("sets up batch textures from ModelExperimental", function () {
    var renderResources = {
      shaderBuilder: new ShaderBuilder(),
      propertyTableId: "mockFeatureTable",
      model: {
        propertyTables: {
          mockFeatureTable: {
            featuresLength: 10,
            batchTexture: {
              batchTexture: 0,
              textureDimensions: {
                y: 2,
              },
              textureStep: 2,
            },
          },
        },
      },
    };

    BatchTexturePipelineStage.process(renderResources, {}, {});
    verifyBatchTextureShaders(renderResources.shaderBuilder);
    verifyBatchTextureUniforms(
      renderResources.model.propertyTables.mockFeatureTable,
      renderResources.uniformMap
    );
  });

  it("sets up batch textures from Cesium3DTileContent", function () {
    var renderResources = {
      shaderBuilder: new ShaderBuilder(),
      propertyTableId: "mockFeatureTable",
      model: {
        content: {
          propertyTables: {
            mockFeatureTable: {
              featuresLength: 10,
              batchTexture: {
                batchTexture: 0,
                textureDimensions: {
                  y: 2,
                },
                textureStep: 2,
              },
            },
          },
        },
      },
    };

    BatchTexturePipelineStage.process(renderResources, {}, {});
    verifyBatchTextureShaders(renderResources.shaderBuilder);
    verifyBatchTextureUniforms(
      renderResources.model.content.propertyTables.mockFeatureTable,
      renderResources.uniformMap
    );
  });
});
